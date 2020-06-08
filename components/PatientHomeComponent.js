import React, { useState } from "react";
import {Button, Content, Left, Right, Row, Col, Icon} from 'native-base';
import { Text, StyleSheet, Image, View, Dimensions, Linking } from 'react-native';
import { AuthContext } from '../context/auth-context';
import IoniconsIcon, { EntypoIcon } from './TabBarIcon';
import { FontAwesome5, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { RectButton } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons';

export default function PatientHomeComponent() {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  let curHr = new Date().getHours;

  const [patientOf, setPatientOf] = React.useState("");

  function OptionButton({ icon, label, onPress, isLastOption }) {
    return (
      <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.optionIconContainer}>
            <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>{label}</Text>
          </View>
        </View>
      </RectButton>
    );
  }

  return (
    <AuthContext.Consumer>
      {
        (context) => 
          <Content padder style={styles.content}>
            <View style={styles.dpView}>
              <View style={{flexDirection: 'row'}}>                
                <Image style={styles.dp} source={require('../assets/images/user.jpg')} />
                <Right>
                  {
                    curHr < 12 ? 
                      (<Text style={styles.welcomeText}>Good Morning!</Text> )
                    : 
                    (
                      curHr < 18 ?
                      (<Text style={styles.welcomeText}>Good Afternoon!</Text> )
                      : (<Text style={styles.welcomeText}>Good Evening!</Text> ) )
                  }
                  <Text style={styles.userText}>
                    { context.userEmail.split("@")[0].charAt(0).toUpperCase() + context.userEmail.split("@")[0].slice(1)}
                     {setUserEmail(context.userEmail)}
                  </Text> 
                </Right>
                </View>               
              </View>
              
              <Row style={{justifyContent: 'center'}}>
                  <Col  style={{marginHorizontal: 10, alignItems: 'center'}}>
                    <Button style={styles.cardSmall}
                    onPress={() => navigation.navigate("Helpline")}>
                      <MaterialCommunityIcons name="headset" color='white' size={50}/>
                      <Text style={styles.headerSmall}>Helpline</Text>
                    </Button>
                  </Col>
                  <Col>
                    <Button style={styles.cardSmall}                     
                     onPress={() => navigation.navigate("Events")}>
                      <FontAwesome name="ticket" color='white' size={50}/>
                      <Text style={styles.headerSmall}>Events</Text>
                    </Button>
                  </Col>
                  {/* <Col>
                    <Button style={styles.cardSmall}
                    onPress={() => navigation.navigate("NearbyListView", {supportPage: 2, })}>
                      <FontAwesome5 name="people-carry" color='white' size={50}/>
                      <Text style={styles.headerSmall}>Support</Text>
                    </Button>
                  </Col> */}
                </Row>
              
                <View style={styles.card}>
                  
                    <View style={{flexDirection: 'row'}}>
                    <IoniconsIcon focused={true} name="ios-people" />
                    <Text style={{paddingTop: 5, marginLeft: 7, fontSize: 16,
                                textAlign: 'left',
                                color: '#2e5c9a',
                                alignSelf: 'flex-start',}}>My Caretaker</Text>
                    </View>
                    <Text></Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text>     </Text>
                        <Text style={{paddingTop: 5, marginLeft: 7, fontSize: 16,
                        textAlign: 'left', fontWeight: 'bold',
                        color: '#2e5c9a',
                        alignSelf: 'flex-start',}}>
                          {context.patientOf.split("@")[0].charAt(0).toUpperCase() 
                          + context.patientOf.split("@")[0].slice(1)}</Text>
                  </View> 
                    <View style={{flexDirection: 'row'}}>
                        <Text>      </Text>
                        <Button transparent
                        onPress={() => Linking.openURL('mailto:' + context.patientOf)}>
                        <Entypo name="mail" size={24} color="#2f95dc" />
                    
                        <Text style={{paddingTop: 5, marginLeft: 7, fontSize: 14,
                        textAlign: 'left',
                        color: '#2e5c9a',
                        alignSelf: 'flex-start',}}>{context.patientOf}</Text>
                            </Button>
                  </View> 

                </View>
                <View style={styles.card}>
                  <Button transparent style={styles.button}
                    onPress={() => {
                        if(Platform.OS === 'ios') {
                            Linking.openURL('calshow:');
                          } else if(Platform.OS === 'android') { 
                            Linking.openURL('content://com.android.calendar/time/');
                          }
                    }}>
                    <View style={{flexDirection: 'row'}}>
                    <Left style={{flexDirection: 'row'}}>
                    <IoniconsIcon focused={true} name="md-calendar"/>
                    <Text style={{paddingTop: 5, marginLeft: 10, fontSize: 16,
                                textAlign: 'left',
                                color: '#2e5c9a',
                                alignSelf: 'flex-start',}}>View Upcoming Tasks in Calendar</Text>
                    </Left>
                  
                    <FontAwesome5 name="angle-right" size={20} color="#2f95dc"/>
                    </View>  
                  </Button>             
                </View>
                    
          </Content>
      }
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
    profilePic: { 
      borderRadius: 200 ,
      width: 370,
      height: 350, 
      alignItems: 'center',        
    },  
    content: {
      backgroundColor: 'white',
      height: Dimensions.get('screen').height
    }, 
    dp: {
      height: 100,
      width: 100,
      borderRadius: 50,
      marginRight: 20
    },
    dpView: {
      marginBottom: 10
    },
    bigIcon :{
      alignSelf: 'center',
      height: 50,
      width: 50
    },
    icon: {
      marginRight: 10
    },
    welcomeText: {
      // fontFamily: 'belleza-regular',
      fontSize: 26,
      textAlign: 'left',
      color: '#2e5c9a',
      fontWeight: 'bold',
      alignSelf: 'flex-start',
    },
    userText: {
      // fontFamily: 'belleza-regular',
      fontSize: 22,
      textAlign: 'left',
      color: '#2e5c9a',
      alignSelf: 'flex-start',
    },
    header: {
      fontSize: 16,
      textAlign: 'center',
      color: '#2e5c9a',
      alignSelf: 'stretch',
    },
    headerSmall: {
      fontSize: 18,
      textAlign: 'center',
      color: 'white',
      alignSelf: 'stretch',
    },
    card: {
    marginBottom: 15,
    padding: 10, 
    shadowColor:'white', 
    borderRadius: 2, 
    shadowOffset: {width:0, height: 10}, 
    shadowOpacity: 0.8, 
    elevation:10, 
    backgroundColor: 'white', 
    },
    cardSmall: {
      marginBottom: 15,
      padding: 10, 
      shadowColor:'white', 
      borderRadius: 2, 
      shadowOffset: {width:0, height: 10}, 
      shadowOpacity: 0.8, 
      elevation:10, 
      backgroundColor: '#2e5c9a', 
      width: Dimensions.get("window").width/2.5,
      height: Dimensions.get("window").width/4,
      flexWrap: 'wrap',
      alignContent: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
      },
    button: {
      justifyContent: 'flex-start',
    },
    accordion: {
      alignSelf: 'flex-start',
      width: '100%',
    },
    website: {
      textAlignVertical: 'center',
      color: '#0000FF',
      textDecorationLine: 'underline'
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
    color: '#2e5c9a',
  },
  viewMore: {
    textAlignVertical: 'center',
    alignSelf: 'flex-end',
    color: 'grey'
  },
  
  });