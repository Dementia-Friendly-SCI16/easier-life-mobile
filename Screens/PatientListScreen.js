import React, {useState, useEffect} from "react";
import { Text, StyleSheet, View, AsyncStorage, TouchableOpacity } from "react-native";
import {Button, Content, Card, CardItem, Right, Icon, ListItem} from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import { AuthContext } from "../context/auth-context";
import { useNavigation } from '@react-navigation/native';

export default function PatientListScreen() {
  const navigation = useNavigation();

  return(       
      <View style={styles.container}>          
          <HeaderComponent headerTitle="My Loved Ones" notifCount="5" showLogo={false}/>
          <Content>
            <AuthContext.Consumer>
              {
                (context) =>context.myPatients.map((patient) =>
                  <ListItem style={styles.patient}>                    
                    <Text>{patient.split("@")[0].charAt(0).toUpperCase() + patient.split("@")[0].slice(1)}</Text>                    
                    <Right style={{flex: 1, flexDirection: 'row-reverse'}}>

                      <TouchableOpacity  style={ styles.buttonView }
                          onPress={() => navigation.navigate("NearbyListView",{patientId: patient, caretakerId: context.userEmail})}>
                          <Icon active name="direction" type="Entypo" style={styles.icon}/>
                          <Text style={styles.iconText}>Vicinity</Text>
                      </TouchableOpacity >

                      <TouchableOpacity  style={ styles.buttonView }
                          onPress={() => navigation.navigate("Tracking",{patientId: patient, caretakerId: context.userEmail, latlong: ""})}>
                          <Icon name="route" type="FontAwesome5" style={styles.icon}/>
                          <Text style={styles.iconText}>Locate</Text>
                      </TouchableOpacity >
                      
                    </Right>                    
                   </ListItem>
                )
              }
            </AuthContext.Consumer>     
        </Content>           
      </View> 
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    alignContent: 'center',
  },
  patient: {
    justifyContent: 'space-evenly',
  },
  buttonView: {
    width: 60,
  },
  
  icon: {
    fontSize: 25,
    color: '#303F9F',
    textAlign: 'center',
    marginBottom: 2
  },
  
  iconText: {
    color: '#303F9F',
    fontSize: 11,
    textAlign: 'center'
  },
});