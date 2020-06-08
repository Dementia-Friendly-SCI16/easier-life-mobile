import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {Button, Content, Segment } from 'native-base';

import HeaderComponent from '../components/HeaderComponent';
import EventsList from '../components/EventsList';

export default function EventsScreen({route}){

    const [activePage, setActivePage] = useState({ activePage : 1});
    const selectComponent = (activePage) => () => setActivePage({activePage});

    return(
        <View style={styles.container}>          
            <HeaderComponent headerTitle="Find Events" notifCount="5" showLogo={false}/>                      
            <Content>           
                <EventsList/>
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
});