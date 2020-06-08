import 'react-native-gesture-handler';
import * as React  from 'react';
import { useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Platform, StatusBar, StyleSheet, View, Text, Image} from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome} from '@expo/vector-icons';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import firebaseConfig from './constants/ApiKeys';
import * as firebase from 'firebase';
import AuthContextProvider, {AuthContext} from './context/auth-context';
import SignUpScreen from './Screens/AuthScreens/SignUpScreen';
import LoginScreen from './Screens/AuthScreens/LoginScreen';

import AppIntroSlider from 'react-native-app-intro-slider';
import slides from './constants/Slides';
import { YellowBox, AsyncStorage } from 'react-native';
import { Button } from 'native-base';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
console.disableYellowBox = true;
console.ignoredYellowBox = ['Setting a timer'];

export default function App(props) {

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const [showRealApp, setShowRealApp] = React.useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = React.useState();
  
  const authContext = React.useContext(AuthContext);

  
    const _renderNextButton = () => {
    return (
      <View style = {{flex: 1, justifyContent: "center", alignContent: "center", alignSelf: "center", alignItems: "center", flexDirection: "row"}}>
        <Text style={{color:'#1b49b5', fontSize:18}}>
          Next {" "}
        </Text>
        <FontAwesome name="angle-double-right" size={24} color="#1b49b5" />
      </View>     
    );
  };

  const _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        
        {
          item.key == 5 ? 
          (
            <></>
          ) :(
          <Text style={styles.skip}
            onPress={() => 
              AsyncStorage.setItem('first_time', 'false').then(() => {
                setShowRealApp(true);
              })}>
          Skip
          </Text>
        )
        }
        {
          item.key != 1 ? 
          (
            <></>
          ) : (
            <View style={{flexDirection:'row'}}>
            <Image style={styles.logo} source={require('./assets/images/logo.png')} /> 
            <Text style={styles.logoText}>   EASIER LIFE</Text>
            </View>
            )
        }        
        <Text style={styles.title}>{item.title}</Text>      
        <Image style={styles.image} source={item.image} />          
        <Text style={styles.text}>{item.text}</Text>
        {
          item.key == slides.length ? 
          (
            <Button style={styles.getStarted}
            onPress={() => 
              AsyncStorage.setItem('first_time', 'false').then(() => {
                setShowRealApp(true);
              })
            }>
              <Text style={{color: 'white'}}>   GET STARTED   </Text>              
            </Button>
          ) : <></>
        }  
      </View>
    );
  }
  const _onDone = () => {
    AsyncStorage.setItem('first_time', 'false').then(() => {
      setShowRealApp(true);
    });
    
  }

  const RootStackScreen = () => (
    
    <AuthContext.Consumer>
      {(context) => <RootStack.Navigator headerMode="none">     
        {/* {context.setContext("isAuthenticated", authContext.isAuth)}   
        {context.setContext("userEmail", authContext.userEmail)}   
        {context.setContext("userRole", authContext.userRole)}   
        {context.setContext("patientOf", authContext.patientOf)}   
        {context.setContext("myPatients", authContext.myPatients)}    */}
        {       
        context.isAuth 
         ? (
          <RootStack.Screen
            name="App"
            component={BottomTabNavigator}
            options={{
              animationEnabled: false
            }}
          />
        ) : (
          <RootStack.Screen
            name="Auth"
            component={AuthStackScreen}
            options={{
              animationEnabled: false
            }}
          />
        )}
      </RootStack.Navigator>}
    </AuthContext.Consumer>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator 
    initialRouteName="SignIn"
    screenOptions={{
      headerShown: false
    }}>
    <AuthStack.Screen name="SignIn" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);
  
// Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        //Initialize firebase if not previously initialized 
        if(!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig.firebaseConfig);
        }
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          Roboto: require('native-base/Fonts/Roboto.ttf'),
          Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),  
          'belleza-regular': require('./assets/fonts/Belleza-Regular.ttf'),    
        });
        AsyncStorage.getItem('first_time').then((value) => {
          setShowRealApp(value == null || value == "true" ? false : true);
        });
      
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    function setContextFromStorage() {
      try {
          console.log("Inside setContextFromStorage of App js");
          AsyncStorage.getItem("isAuthenticated").then(isAuthenticated => 
              {
                // console.log("isAuthenticated of App js", isAuthenticated);
                // authContext.isAuth = isAuthenticated !== null && isAuthenticated == "true" ? true : false;
                authContext.setContext("isAuthenticated", isAuthenticated !== null && isAuthenticated == "true" ? true : false);
                console.log("authContext.isAuth of App js", authContext.isAuth);
              }
            );
          AsyncStorage.getItem("userEmail").then(email =>
            {
              // console.log("email of App js", email);
              authContext.userEmail = email !== null ? email : "";
              authContext.setContext("userEmail",email !== null ? email : "");
              // console.log("authContext.email of App js", authContext.userEmail);
            }
          );
          AsyncStorage.getItem("userRole").then(role =>
            {
              // console.log("role of App js", role);
              authContext.userRole = role !== null ? role : "";
              authContext.setContext("userRole",role !== null ? role : "");
              // console.log("authContext.role of App js", authContext.userRole);
            }
          );
          AsyncStorage.getItem("patientOf").then(caretaker => 
            {
              // console.log("caretaker of App js", caretaker);
              authContext.patientOf = caretaker !== null ? caretaker : "";
              authContext.setContext("patientOf", caretaker !== null ? caretaker : "");
              // console.log("authContext.caretaker of App js", authContext.patientOf);
            }
          );
          AsyncStorage.getItem("myPatients").then(myPs => 
            {
              // console.log("myPs of App js", myPs);
              authContext.myPatients = myPs !== null ? myPs.split(",") : [""];
              authContext.setContext("myPatients", myPs !== null ? myPs.split(",") : [""]);
              // console.log("authContext.myPatients of App js", authContext.myPatients);
            }
          );
      }
      catch (error) {
          console.log("Error setContextFromStorage",error.message);
      }
    }
    console.ignoredYellowBox = [
      'Setting a timer'
      ];
    loadResourcesAndDataAsync();
    // setContextFromStorage();
    
  },[]);


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    if (showRealApp ){//|| authContext.isAuth) {
      {console.log("if (showRealApp || isUserAuthenticated)", showRealApp)}//, authContext.isAuth)}
      return (
        <AuthContextProvider>  
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}          
              <NavigationContainer ref={containerRef} initialState={initialNavigationState}> 
                <RootStackScreen/>    
              </NavigationContainer>
            </View>
        </AuthContextProvider>
      );
    }
    else if (!showRealApp)
  {
    return (
    <AppIntroSlider 
    renderItem={_renderItem} 
    renderNextButton={_renderNextButton}
    activeDotStyle={styles.activeDot}
    doneLabel
    data={slides} 
    onDone={_onDone} />
    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getStarted: {
    backgroundColor: '#1b49b5',
    justifyContent: 'space-around',
    marginTop: 20,
    borderRadius: 5
  },
  skip: {
    color:'#808080', 
    fontSize:16, 
    fontWeight:'bold', 
    position:'absolute', 
    top: 30, 
    right:10
  },
  activeDot: {
    backgroundColor: '#1b49b5'
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  logo: {
    width: 48,
    height: 55,
  },
  logoText: {
    fontSize: 37,
    fontWeight: 'bold'
  },
  text: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontFamily: 'belleza-regular'
  },
});


