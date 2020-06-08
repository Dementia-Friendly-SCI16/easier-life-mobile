import React, {useState, useContext} from 'react';
import { ToastAndroid , AsyncStorage} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';

export const AuthContext = React.createContext({
    isAuth: false,
    userEmail: '',
    userRole: '',
    login: (email, password) => {},
    logout: () => {},
    signUp: (cEmail, cPassword, role, pEmail, pPassword) => {},
    myPatients: [""],
    patientOf: '',
    error: '',
    setContext: () => {},
});


export const PatientContext = React.createContext({
    getMyPatients: (email, role) => {},
    myPatients: [""],
});

export const PatientContextProvider = props => {
    const dbh = firebase.firestore();
    const [myPatients, setMyPatients] = useState([""]);

    const getMyPatientsHandler = (email, role) => { 
        if (role == "C") {
            let myPatientsRef = dbh.collection('caretaker_patient').doc(email);
            let getDoc = myPatientsRef.get()
                    .then(doc => {
                      if (!doc.exists) {
                        console.log('No such document!');
                      } else {
                        setMyPatients(doc.data().patients);
                      }
                    })
                    .catch(err => {
                      console.log('Error getting document', err);
                    });     
        }   
         
    };

    return(
        <PatientContext.Provider value={
            {
                getMyPatients: getMyPatientsHandler,
                myPatients: myPatients,            
            }
        }>
            {props.children}
        </PatientContext.Provider>
    )
}

const AuthContextProvider = props => {

    const dbh = firebase.firestore();

    const [isAuthenticated, setIsAuthenticated] = useState();
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [patientOf, setPatientOf] = useState('');
    const [myPatients, setMyPatients] = useState([""]);
    const PATIENT = "P";

    const [error, setError] = useState("");
    const showToast = (error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT);
    };

    const setContextHandler = (key, value) => {
        console.log("key, value in setContextHandler", key, value);
        switch(key) {
 
            case 'isAuthenticated':
                setIsAuthenticated(value);
                break;
            
            case 'userEmail':
                setUserEmail(value);
              break;
       
            case 'userRole':
                setUserRole(value);
                break;
       
            case 'patientOf':
                setPatientOf(value);
                break;
            
            case 'myPatients':
                setMyPatients(value);
                break;
        }
    }
    
    const setAuthDetailsAsyncStorage = async (key, value) => {
    try {
        key == "isAuthenticated" ?
            await AsyncStorage.setItem(key, value ? "true" : "false")
        :
        (
            key == "myPatients" ? await AsyncStorage.setItem(key, value.toString())
            :
            await AsyncStorage.setItem(key, value)
        )
        if(key== "userEmail") {
            const ue = await AsyncStorage.getItem('userEmail');
            ue !== null ? console.log("ue", ue) : console.log("ue not found", ue);
        }               
    } catch (error) {
        // Error retrieving data
        console.log("Error AsyncStorage",error.message);
    }
    };
    
    const loginHandler = (email,password) => {
        try {
            firebase.auth().signInWithEmailAndPassword(email,password)
            .then(user => {
                setIsAuthenticated(true);
                setUserEmail(email);
                setAuthDetailsAsyncStorage("userEmail", email);
                setAuthDetailsAsyncStorage("isAuthenticated", true);
                setContextHandler("userEmail", email);
                setContextHandler("isAuthenticated", true);
                getUserRole(email);
            }                
            )
            .catch(function(error) {
                setIsAuthenticated(false);
                setUserEmail('');
                setAuthDetailsAsyncStorage("userEmail", "");
                setAuthDetailsAsyncStorage("isAuthenticated", false);
                setContextHandler("userEmail", "");
                setContextHandler("isAuthenticated", false);
                setError(error.toString());
                console.log(error.toString());
                showToast(error.toString());
            })                       
        }
        catch(error) {
            console.log(error.toString());
            setIsAuthenticated(false);
            setUserEmail('');
            setAuthDetailsAsyncStorage("userEmail", "");
            setAuthDetailsAsyncStorage("isAuthenticated", false);
            setContextHandler("userEmail", "");
            setContextHandler("isAuthenticated", false);
            setError("Error logging in. Please try again");
        }
    }

    const signUpHandler = (cEmail, cPassword, role, pEmail, pPassword) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(cEmail == "" || cPassword == "" || pEmail == "" || pPassword == "")
        {
            setError("Please fill all the details before proceeding.");
        }
        else if(cEmail == pEmail) {
            setError("Caregiver and Patient email cannot be the same. \nPlease enter valid credentials.");
        }        
        else if (reg.test(cEmail) === false){
            setError("Please enter your valid email address.");
        }
        else if (reg.test(pEmail) === false){
            setError("Please enter valid email address for your loved one.");
        }
        else {       
            try {
                firebase.auth().createUserWithEmailAndPassword(cEmail,cPassword)
                .then(user => {
                    setIsAuthenticated(true);
                    setUserEmail(cEmail);
                    setUserRole(role);
                    setAuthDetailsAsyncStorage("userEmail", cEmail);
                    setAuthDetailsAsyncStorage("userRole", role);
                    setAuthDetailsAsyncStorage("isAuthenticated", true);
                    setContextHandler("userEmail", cEmail);
                    setContextHandler("isAuthenticated", true);
                    setContextHandler("userRole", role);
                    console.log("Caretaker signed Up")
                
                    firebase.auth().createUserWithEmailAndPassword(pEmail,pPassword)
                    .then(
                        console.log("Patiend signed Up")
                    )
                    .catch(function(error) {
                        console.log("Error signing up patient");
                        user.delete().then(function() {
                            // User deleted.
                            console.log("Caretaker deleted")
                        }).catch(function(error) {
                            // An error happened.
                            console.log("Error while deleting caretaker")
                        });
                    }
                    )
                })
                .then(
                    createUserInFirestore(cEmail, role, pEmail)
                    .then(
                        console.log("All data added to firestore")
                    )
                    .catch(
                        function(error) {
                            console.log("Error createUserInFirestore")
                        }
                    )
                )
                .catch(function(error) {
                    setIsAuthenticated(false);
                    setUserEmail('');
                    setAuthDetailsAsyncStorage("userEmail", "");
                    setAuthDetailsAsyncStorage("isAuthenticated", false);
                    setContextHandler("userEmail", "");
                    setContextHandler("isAuthenticated", false);
                    setError(error.toString());
                    console.log(error.toString());
                    showToast(error.toString());
                })                       
            }
            catch(error) {
                console.log(error.toString());
                setIsAuthenticated(false);
                setUserEmail('');
                setAuthDetailsAsyncStorage("userEmail", "");
                setAuthDetailsAsyncStorage("isAuthenticated", false);
                setContextHandler("userEmail", "");
                setContextHandler("isAuthenticated", false);
                setError("Error signing in. Please try again");
            }
        }
    }

    const logoutHandler = () => {
        setIsAuthenticated(false);
        setUserEmail('');
        setUserRole('');
        setPatientOf('');
        setMyPatients([""]);
        //Need async storage written
        setAuthDetailsAsyncStorage("userEmail", "");
        setAuthDetailsAsyncStorage("isAuthenticated", false);
        setAuthDetailsAsyncStorage("userRole", "");
        setAuthDetailsAsyncStorage("patientOf", "");
        setAuthDetailsAsyncStorage("myPatients", [""]);
        // setContextHandler("userEmail", "");
        // setContextHandler("isAuthenticated", false);
        // setContextHandler("userRole", "");
        // setContextHandler("patientOf", "");
        // setContextHandler("myPatients", [""]);
        setError('');
    }

    const createUserInFirestore = (email, role, patient) => {

        //Adding caretaker
        dbh.collection('users').doc(email).set({
            role: role
        })
        .then(
            // //Adding patient 1 Patient : 1 Caretaker
            dbh.collection('users').doc(patient).set({
                role: "P",
                caretaker: email
            })
            .then(
                    //Adding relationship 1 Caretaker : N Patients
                    dbh.collection('caretaker_patient').doc(email).set({
                    patients: [patient]
                    }).then(
                    getMyPatients(email, role)
                    )
                    .catch(
                        function(error) {
                            console.log("Error Adding relationship 1 Caretaker : N Patients")
                        }
                    )
            )
            .catch(
                function(error) {
                    console.log("Error Adding patient 1 Patient : 1 Caretaker")
                }
            )
        )
        .catch(
            function(error) {
                console.log("Error Adding Caretaker")
            }
        )
        


    }

    const getUserRole = (email) => {
        let userRoleRef = dbh.collection('users').doc(email);
        let getDoc = userRoleRef.get()
            .then(doc => {
                if (!doc.exists) {
                console.log('No such user found!');
                } else {
                setUserRole(doc.data().role); 
                setAuthDetailsAsyncStorage("userRole", doc.data().role);
                getMyPatients(email,doc.data().role); 
                
                if(doc.data().role == PATIENT)
                    setPatientOf(doc.data().caretaker);
                    setAuthDetailsAsyncStorage("patientOf", doc.data().caretaker);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });      
    }

    const getMyPatients = (email, role) => { 
        if (role == "C") {
            let myPatientsRef = dbh.collection('caretaker_patient').doc(email);
            let getDoc = myPatientsRef.get()
                    .then(doc => {
                      if (!doc.exists) {
                        console.log('No such document!');
                      } else {
                        setMyPatients(doc.data().patients);
                        setAuthDetailsAsyncStorage("myPatients", doc.data().patients);
                      }
                    })
                    .catch(err => {
                      console.log('Error getting document', err);
                    });     
        }   
         
    };

    return(
        <AuthContext.Provider value={
            {
                login: loginHandler,
                logout: logoutHandler,
                signUp: signUpHandler,
                setContext: setContextHandler,
                isAuth: isAuthenticated,
                userRole: userRole,
                userEmail: userEmail, 
                myPatients: myPatients,  
                patientOf: patientOf,    
                error: error,    
            }
        }>
            {props.children}
        </AuthContext.Provider>
    )
};

export default AuthContextProvider;