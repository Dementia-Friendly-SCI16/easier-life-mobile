import React, { useState, useEffect } from 'react';
import MapView, {Polyline, Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import {Content, Card, CardItem, Button, Icon, } from 'native-base';
import HeaderComponent from '../components/HeaderComponent';
import { StyleSheet, Text, View, Dimensions, Platform, } from 'react-native';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import { Linking } from 'expo';
import { useNavigation } from '@react-navigation/native';

export default function TrackingScreen({ route }) {
    const navigation = useNavigation();
    const { patientId } = route.params;
    const { caretakerId } = route.params;
    const pId = JSON.stringify(patientId).split("@")[0].split('"')[1];
    const cId = JSON.stringify(caretakerId).split("@")[0].split('"')[1];
    
    const [patientAddress, setPatientAddress] = useState("");

    const [patientCoordinates,setPatientCoordinates] = useState([]);

    const [patientMarker, setPatientMarker] = useState(null);
    
    const [myLocation, setMyLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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
        if(currLocObj != myLocation) {
          setMyLocation(currLocObj);         
        } 
        }
        loadCaretakersLocation();
      });


      useEffect(() => {
        async function loadResourcesAndDataAsync() {
        try
        { 
            firebase.database().ref(cId + '/' + pId +'/')
                  .orderByChild('timestamp')
                  .once('value', (snapshot) => {                    
                      const allLocations = snapshot.val();
                      
                      for(loc in allLocations){
                        newStartTimestamp = allLocations[loc].timestamp;
                        if(patientCoordinates != []) {
                          setPatientCoordinates(patientCoordinates => [...patientCoordinates, 
                            {
                              latitude: allLocations[loc].latitude,
                              longitude: allLocations[loc].longitude,
                            }]);
                        }
                        else {
                          setPatientCoordinates([ 
                            {
                              latitude: allLocations[loc].latitude,
                              longitude: allLocations[loc].longitude,
                            }]);
                        }                         
                        
                      }    
                      const maxTimestamp = Math.max(parseInt(Object.keys(allLocations)));
                      console.log("max timestamp",Math.max(parseInt(Object.keys(allLocations))));
                        // Object.keys(allLocations)
                      getPatientAddress(allLocations[maxTimestamp].latitude,allLocations[maxTimestamp].longitude);
                    });
            
          }    
           catch (error) {
            console.log("error", error);
          }
        }

        async function getPatientAddress(lat, long) {
          setPatientMarker({
            latitude: lat,
            longitude: long,
          })
          let patientAddr = await Location.reverseGeocodeAsync({latitude:lat,longitude:long})
          
          patientAddr.map(entry => 
            setPatientAddress(entry.name + " " + entry.street + ", " + entry.city + ", " + entry.region + " " +entry.postalCode)
          )
          
        }
     
      loadResourcesAndDataAsync();
  }, [pId, patientAddress]);
  
    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
        console.log(text);
    }  
    return (
      <View style={styles.container}>
        <HeaderComponent headerTitle="Tracking" notifCount="5" showLogo={false}/>
        <Content>
         
        <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation = {true}
            showsMyLocationButton = {true}
            showsCompass = {true}
            zoomEnabled = {true}
            rotateEnabled = {true}
            scrollEnabled = {true}
            toolbarEnabled = {true}
            loadingEnabled = {true}
            moveOnMarkerPress = {true} 
            initialRegion={{
                latitude: patientMarker != null ? patientMarker.latitude : -37.877132, 
                longitude: patientMarker != null ? patientMarker.longitude : 145.045105,
                latitudeDelta: 0.005,
                longitudeDelta: 0.09,
              }}
            style={styles.mapStyle}
            >
              {/* Map marker taken from https://icons8.com/icons/set/street-view*/}
              {myLocation != null ? 
                <Marker                  
                coordinate={myLocation}
                  image={require('../assets/images/caretakerMarker.png')}>
                  <Callout>
                    <Card>
                      <CardItem>
                        <Text style={styles.header}>{cId}</Text>
                      </CardItem> 
                    </Card>
                  </Callout>
              </Marker> : <></>  
              }
              
              { patientMarker != null ?
                <Marker
                coordinate={patientMarker}
                >                  
                  <Callout
                    onPress={
                      () => {              
                        Platform.OS == 'android' ?
                        Linking.openURL('google.navigation:q='+ patientMarker.latitude + "," + patientMarker.longitude)
                        : (
                          Linking.openURL('maps://app?saddr='+ myLocation.latitude + "," + myLocation.longitude + '&daddr='+ patientMarker.latitude + "," + patientMarker.longitude)
                        )
                    }
                    }
                    >
                    <Card>
                      <CardItem>
                        <Text style={styles.header}>{pId}</Text>
                      </CardItem>
                      <CardItem>
                        <Text>{patientAddress}</Text>
                      </CardItem>  
                      <CardItem>
                        <Button transparent style={styles.find}>
                          <Text note style={styles.details}>Directions</Text>
                          <Icon name="directions" type="FontAwesome5" />
                      </Button> 
                      </CardItem> 
                    </Card>
                  </Callout>
              </Marker> : <></> 
              }

              {
                patientCoordinates != null ?
                <Polyline
              coordinates={patientCoordinates}
              strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={3}
              /> : <></> 
              }
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
  header: {
    fontWeight: 'bold',
    color: '#2e5c9a',
    fontSize: 16,
},
details: {
    textAlignVertical: 'center',
    color: 'grey',
},
find: {
  flexDirection: 'row',
  position: 'absolute',
  right: 0,
  bottom: 0
}
});
