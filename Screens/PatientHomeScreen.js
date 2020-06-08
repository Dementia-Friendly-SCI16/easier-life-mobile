import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import { AuthContext } from '../context/auth-context';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import PatientHomeComponent from '../components/PatientHomeComponent';

export default function PatientHomeScreen() {

  const authContext = useContext(AuthContext);

  const cId = authContext.patientOf.split("@")[0];
  const pId = authContext.userEmail.split("@")[0];

  const [myLocation, setMyLocation] = useState(
    {latitude: -37,
    longitude: 145
  });

  useEffect(() => {
    
    async function loadCaretakersLocation() {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      let currLocObj = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      }
      if(JSON.stringify(currLocObj) != JSON.stringify(myLocation)) {
        setMyLocation(currLocObj); 
        
        
        const currTimestamp = new Date().getTime();
        //Call to firebase
        try {
          if(cId != "" && pId != "" && currTimestamp != "")
          {  
            let ref = firebase.database().ref(cId + '/' + pId +'/'+ currTimestamp + '/');
            firebase.database().ref(cId + '/' + pId +'/'+ currTimestamp + '/').set({
              latitude: currLocObj.latitude,
              longitude: currLocObj.longitude,
              timestamp : currTimestamp,
            }).then(
              console.log("Data sent to firebase", {
                latitude: currLocObj.latitude,
                longitude: currLocObj.longitude,
                timestamp : currTimestamp,
              })
            )
            .catch(function(error) {
              console.log("Location data not sent to firebase", error); 
            });

            
          }
        }
        catch (error) {
          console.log("Send data to firebase error", error);
        }
      } 
      }
      loadCaretakersLocation();
    });

  return(
    <View style={styles.container}>                    
      <HeaderComponent headerTitle="Easier Life" notifCount="5"/>
      <PatientHomeComponent/>
    </View>
  );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      resizeMode: 'cover',
      alignContent: 'center',
    },
  });