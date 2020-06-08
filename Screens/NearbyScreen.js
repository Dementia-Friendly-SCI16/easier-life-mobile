import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout} from 'react-native-maps';
import {Content, Icon, } from 'native-base';
import HeaderComponent from '../components/HeaderComponent';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { getDistance } from 'geolib';

const SOURCE_BOTTOMTAB = "B";
const SOURCE_PATIENTLIST = "P";

export default function NearbyScreen({ route }) {

  const dbh = firebase.firestore();
  const [source, setSource] = useState(route.params != undefined ? SOURCE_PATIENTLIST : SOURCE_BOTTOMTAB);
  const [pId, setPId] = useState('');
  const [cId, setCId] = useState(''); 

  const [region, onRegionChange] = useState(
    {
      latitude: -37.877610, 
      longitude: 145.034100,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    },
  );

  const [myLocation, setMyLocation] = useState(
    {
      latitude: region.latitude, 
      longitude: region.longitude,
    });
  
  const [patientLocation, setPatientLocation] = useState({
    latitude: region.latitude, 
    longitude: region.longitude,
  });

  const [allHospitals, setAllHospitals] = useState(
    [{
      latitude: region.latitude, 
      longitude: region.longitude,
      fullData: cId,
    }]
  );
  const [nearbyHospitals, setNearbyHospitals] = useState(
    [{
      latitude: region.latitude, 
      longitude: region.longitude,
      fullData: cId,
    }]
  );

  useEffect(() => {
    setNearbyHospitals([{
      latitude: region.latitude, 
      longitude: region.longitude,
      fullData: cId,
    }])
    if(source == SOURCE_PATIENTLIST) {
    const { patientId } = route.params;
    const { caretakerId } = route.params;
    setPId(JSON.stringify(patientId).split("@")[0].split('"')[1]);
    setCId(JSON.stringify(caretakerId).split("@")[0].split('"')[1]);
    console.log(pId, cId);
  }
   fetchAllHospitals();
  },[source]);

  useEffect(() => {
    if(source==SOURCE_BOTTOMTAB)
     { 
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
      if(currLocObj != myLocation) {
        setMyLocation(currLocObj);         
      } 
      }
      loadCaretakersLocation();
    }
    });


  const fetchAllHospitals = () => {
    let hospitalsRef = dbh.collection('hospitals');
    if(source == SOURCE_PATIENTLIST) {
      //Implement get pId's last location
        try
        { 
            firebase.database().ref().child("urmisubs").child("easypatient1")
                  .orderByChild('timestamp').limitToLast(1)
                  .once('value', (snapshot) => {                    
                      const allLocations = snapshot.val();
                      for(loc in allLocations){                        
                            setPatientLocation({
                              latitude: allLocations[loc].latitude,
                              longitude: allLocations[loc].longitude,
                            })
                        }                                     
                    }).then(()=> {
                      let allHospitalsFromDb = hospitalsRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const newHospital = {
          latitude: parseFloat(doc.data().Y),
          longitude: parseFloat(doc.data().X),
          fullData: doc.data(),
        };
        let dist = 0;
        if(source == SOURCE_PATIENTLIST)
        {
           dist = getDistance(
          { latitude: newHospital.latitude, longitude: newHospital.longitude },
          { latitude: patientLocation.latitude, longitude: patientLocation.longitude }, 
        );
        }
        else if(source == SOURCE_BOTTOMTAB) {
          dist = getDistance(
            { latitude: newHospital.latitude, longitude: newHospital.longitude },
            { latitude: myLocation.latitude, longitude: myLocation.longitude }, 
          );
        }
        if(dist< 5000) {
          setNearbyHospitals(nearbyHospitals=> [...nearbyHospitals, newHospital]); 
        }
        setAllHospitals(allHospitals=> [...allHospitals, newHospital]); 
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
   } );       
            
        }    
        catch (error) {
        console.log("error", error);
      }
    }
    else {
      let allHospitalsFromDb = hospitalsRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const newHospital = {
          latitude: parseFloat(doc.data().Y),
          longitude: parseFloat(doc.data().X),
          fullData: doc.data(),
        };
        let dist = 0;
        if(source == SOURCE_BOTTOMTAB) {
          dist = getDistance(
            { latitude: newHospital.latitude, longitude: newHospital.longitude },
            { latitude: myLocation.latitude, longitude: myLocation.longitude }, 
          );
        }
        if(dist< 5000) {
          setNearbyHospitals(nearbyHospitals=> [...nearbyHospitals, newHospital]); 
        }
        setAllHospitals(allHospitals=> [...allHospitals, newHospital]); 
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
   }
    }   
  
  return (
    <View style={styles.container}>
      <HeaderComponent headerTitle="What's Near By" notifCount="5" showLogo={false}/>
      <Content>
         <MapView
        //  provider={PROVIDER_GOOGLE}
         showsUserLocation = {true}
         showsMyLocationButton = {true}
         showsCompass = {true}
         zoomEnabled = {true}
         rotateEnabled = {true}
         scrollEnabled = {true}
         toolbarEnabled = {true}  
         loadingEnabled = {true}
         moveOnMarkerPress = {true}  
         region={{
             latitude: region.latitude, 
             longitude: region.longitude,
             latitudeDelta: region.latitudeDelta,
             longitudeDelta: region.longitudeDelta,
           }}
         onRegionChange={() => onRegionChange(region)}
         style={styles.mapStyle}
         >
           {
             nearbyHospitals.map(hospital =>             
               <Marker
                   coordinate={{
                     latitude: parseFloat(hospital.latitude),
                     longitude: parseFloat(hospital.longitude)
                   }}>
                   <Callout>
                       <Text>{hospital.fullData.HospitalName}</Text>
                       <Text>{hospital.fullData.Address}, {hospital.fullData.Address}</Text>
                       <Text>{hospital.fullData.Telephone}</Text>
                   </Callout>
               </Marker>
           )}
     </MapView>
        </Content>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
