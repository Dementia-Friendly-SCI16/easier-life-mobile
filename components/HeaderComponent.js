import React from "react";
import {Button, Header, Left, Body, Right, Title, Badge } from 'native-base';
import { Text, StyleSheet, Image } from 'react-native';
import {BackIcon, NotificationIcon} from './TabBarIcon';
import { useNavigation } from '@react-navigation/native';

export default function HeaderComponent(props) {
  const navigation = useNavigation();

    return (
    <Header>
        {props.showLogo ? (
            <Left>
              <Button transparent
                onPress={() => navigation.navigate('Home') }>
                <Image 
                  source={require('../assets/images/logo.png')} 
                  style={styles.logo}
                  />
                </Button>
            </Left>) : (
            <Left>
              <Button transparent
                onPress={() => navigation.goBack()}>
              <BackIcon/></Button>
            </Left>
            )}
            
            <Body>
              <Title>{props.headerTitle}</Title>
            </Body>
            <Right>
              <Button transparent>                
                {/* <NotificationIcon/>
                <Badge style={styles.badge}><Text style={{color: 'white'}}>{props.notifCount}</Text></Badge> */}
              </Button>              
            </Right>
        </Header>
    );
};

const styles = StyleSheet.create({
    logo: {
        resizeMode: 'stretch',
        height: 40,
        width: 40,
    },
    badge: {
      position: 'relative',
      justifyContent: 'center',      
    }
});