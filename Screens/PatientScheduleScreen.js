import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import { AuthContext } from '../context/auth-context';
import { Button } from "native-base";

export default function PatientScheduleScreen(){

    const [myStateEvents, setMyEvents] = useState([{}]);
    const authContext = useContext(AuthContext);
    const [isLoading, setLoading] = useState(true);
    let myEvents = [];
    // let size = myEvents.length;
    getCalendar = async () => {
        await Permissions.askAsync('calendar');
        const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        
        const cal = cals.find(c => Platform.OS == 'android' ? c.ownerAccount == authContext.userEmail 
                                                            : c.title == authContext.userEmail)
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const events = await Calendar.getEventsAsync([cal.id], yesterday, nextYear);
        let myEs = [];
        events.forEach(function(element) {
            myEs = [...myEs, element];            
        });
        myEvents= myEs;
        size = myEvents.length;
        console.log("size", size);
        
    }

    useEffect(() => {
        // setLoading(true);
        getCalendar();  
        setMyEvents(myEvents); 
        setLoading(false);
        console.log(isLoading);     
    });

    
    return(
        <View style={styles.container}>
            {console.log("myEvents", myEvents)}
            {
                isLoading ? <ActivityIndicator/> : (
                <PatientComponent events={myStateEvents}></PatientComponent>
                )
                
            }
        </View>
    )
};

export function PatientComponent(props) {
    console.log("props.events",props.events);

    useEffect(()=>{
        console.log("Component's useEffct")
    },[props.events])
    return(
        <View>
            <Text>{props.events[1].notes}</Text>
        </View>
    )
}    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});