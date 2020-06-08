import React, { useState, useEffect  }from 'react';
import MapView, {Polyline, Marker, Callout} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as firebase from 'firebase';

export default function PatientMapScreen() {

    const [latestLocation, updateLatestLocation] = useState(null);
    const [region, onRegionChange] = useState(null);
        // {
        //     latitude: -37.877610, 
        //     longitude: 145.034100,
        //     latitudeDelta: 0.0922,
        //     longitudeDelta: 0.0421,
        //   },     
    const [errorMsg, setErrorMsg] = useState(null);
    const [myLocations, addMyLocation] = useState(null);

    let marker = coordinates.length > 0 ? {
      latitude: coordinates[coordinates.length-1].latitude,
      longitude: coordinates[coordinates.length-1].longitude
      } : null;

    let { status } = await Location.requestPermissionsAsync();

    function setupPatientLocationListener(userId) {
      firebase.database().ref('patientLocation/' + userId).on('value', (snapshot) => {
        const allLocations = snapshot.val();

        if(JSON.stringify(coordinates[coordinates.length-1]) != JSON.stringify({
                                                  latitude: allLocations[allLocations.length-1].latitude, 
                                                  longitude: allLocations[allLocations.length-1].longitude
                                                })) {
                                                  

            coordinates.push({
              latitude: allLocations[allLocations.length-1].latitude,
              longitude: allLocations[allLocations.length-1].longitude
            })
            console.log("new location added to list");
          }
          else {
            console.log("No change in user location");
          }
      });
    }

    function storeUserLocation(userId, latitude, longitude, timestamp) {
      const locID = new Date().getTime();
      firebase.database().ref('patientLocation/' + userId + '/' + timestamp + '/').set({     
            latitude: latitude,
            longitude: longitude,        
      }).then(() => {
        console.log("Inserted new user location");
      }).catch((error) => {
        console.log("ERROR while inserting new location", error);
      });
    }

    useEffect(() => {
        (async () => {        
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }
            // Example location: 
            //     {
            //     "timestamp":1587050823039,
            //     "mocked":false,
            //     "coords":
            //         {
            //             "altitude":55.19999694824219,
            //             "heading":21.357107162475586,
            //             "longitude":145.0417297,
            //             "speed":0.7982712388038635,
            //             "latitude":-37.8884432, 
            //             "accuracy":16.35700035095215
            //         }
            //     }
            let interval = setInterval(() => {
                location = await Location.getCurrentPositionAsync({});
                updateLatestLocation  ({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
            });
        });
    });

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        console.log(JSON.stringify(location));
        //setupPatientLocationListener("urmi94");
        //storeUserLocation("urmi94");
    }
    return (
    <View style={styles.container}>
        <MapView
            region={{
                latitude: region.latitude, 
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              }}
            onRegionChange={() => onRegionChange(region)}
            style={styles.mapStyle}
            >
                <Marker
                    coordinate={{
                        latitude: marker.latitude, 
                        longitude: marker.longitude
                    }}>
                    <Callout>
                        <Text>{marker.latitude},{marker.longitude}</Text>
                    </Callout>
                </Marker>
                <Polyline
                coordinates={coordinates}
                strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
                strokeWidth={5}
                />
        </MapView>
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
