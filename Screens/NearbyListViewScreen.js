import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {Button, Content, Segment } from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import LocationList from '../components/LocationList';

import * as Location from 'expo-location';
import * as firebase from 'firebase';

export default function NearbyListViewScreen({route}){

    const [activePage, setActivePage] = useState({ activePage : 1});
    const [latlong, setLatlong] = useState("");
    const selectComponent = (activePage) => () => setActivePage({activePage});
    let pId, cId = "";

    useEffect(() => {
        
        if( route.params != undefined )
        {
            const { supportPage } = route.params;
            const { patientId } = route.params;
            const { caretakerId } = route.params;
            console.log("supportPage", supportPage);
            if(supportPage == undefined && patientId != undefined && caretakerId != undefined){               
                pId = JSON.stringify(patientId).split("@")[0].split('"')[1];
                cId= JSON.stringify(caretakerId).split("@")[0].split('"')[1];

                if(pId != "" && cId != "") {
                    firebase.database().ref().child(cId).child(pId)
                    .orderByChild('timestamp').limitToLast(1)
                    .once('value', (snapshot) => {                    
                        const allLocations = snapshot.val();
                        for(loc in allLocations){                        
                            setLatlong(allLocations[loc].latitude.toString() + "," + allLocations[loc].longitude.toString());
                        }                                     
                        })
                }
            }
            else {
                setActivePage({ activePage : supportPage})
            }
            
        }
        else  //Bottom tab navigation        
        { 
            async function loadCaretakersLocation() {
             let { status } = await Location.requestPermissionsAsync();
             if (status !== 'granted') {
                 setErrorMsg('Permission to access location was denied');
             }
       
             let currentLocation = await Location.getCurrentPositionAsync({});
             setLatlong(currentLocation.coords.latitude.toString() + "," + currentLocation.coords.longitude.toString());
             }
             loadCaretakersLocation();
        }
    },[route.params]);

    return(
        <View style={styles.container}>          
            <HeaderComponent headerTitle="What's Nearby" notifCount="5" showLogo={false}/>
            <Segment style={styles.segment}>
                <Button first active={activePage.activePage == 1} 
                    style={activePage.activePage == 1 ? (Platform.OS == 'ios' ? styles.segButtonSelectedIos : styles.segButtonSelected) : (Platform.OS == 'ios' ? styles.segButtonIos : styles.segButton)}
                    onPress={selectComponent(1)}><Text 
                        style={activePage.activePage == 1 ? (Platform.OS == 'ios' ? styles.segTextSelectedIos : styles.segTextSelected) : (Platform.OS == 'ios' ? styles.segTextIos : styles.segText)}
                    >Infirmaries</Text></Button>
                <Button  active={activePage.activePage == 2} 
                    style={activePage.activePage == 2 ? (Platform.OS == 'ios' ? styles.segButtonSelectedIos : styles.segButtonSelected) : (Platform.OS == 'ios' ? styles.segButtonIos : styles.segButton)}
                    onPress= {selectComponent(2)}><Text 
                    style={activePage.activePage == 2 ? (Platform.OS == 'ios' ? styles.segTextSelectedIos : styles.segTextSelected) : (Platform.OS == 'ios' ? styles.segTextIos : styles.segText)}   
                    >Support</Text></Button>
                <Button  last active={activePage.activePage == 3} 
                    style={activePage.activePage == 3 ? (Platform.OS == 'ios' ? styles.segButtonSelectedIos : styles.segButtonSelected) : (Platform.OS == 'ios' ? styles.segButtonIos : styles.segButton)}
                    onPress= {selectComponent(3)}><Text 
                    style={activePage.activePage == 3 ? (Platform.OS == 'ios' ? styles.segTextSelectedIos : styles.segTextSelected) : (Platform.OS == 'ios' ? styles.segTextIos : styles.segText)}
                    >Care Homes</Text></Button>
            </Segment>
            <Content>           
                <LocationList type={activePage.activePage} latlong={latlong}/>
            </Content>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        alignContent: 'center',
      },
    segment:{
        paddingHorizontal: 10
    },
    segButton: {
        justifyContent: 'space-evenly',
        borderColor:'white',
        backgroundColor: 'transparent',
        width: '33.33%',
    },
    segButtonSelected: {
        justifyContent: 'space-evenly',
        borderColor:'white',
        backgroundColor: 'white',
        width: '33.33%'
    },
    segButtonIos: {
        justifyContent: 'space-evenly',
        borderColor: '#007bff',
        backgroundColor: 'transparent',
        width: '33.33%',
    },
    segButtonSelectedIos: {
        justifyContent: 'space-evenly',
        borderColor: '#007bff',
        backgroundColor: '#007bff',
        width: '33.33%'
    },
    segText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },    
    segTextSelected: {
        color: '#2e5c9a',
        fontWeight: 'bold',
        fontSize: 16,
    },
    segTextIos: {
        color: '#007bff',
        fontSize: 16,
    },    
    segTextSelectedIos: {
        color: 'white',
        fontSize: 16,
    },
});