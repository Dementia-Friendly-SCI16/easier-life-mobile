import { createStackNavigator } from "@react-navigation/stack";
import * as React from 'react';
import PatientHomeScreen from '../Screens/PatientHomeScreen';
import NearbyListViewScreen from '../Screens/NearbyListViewScreen';
import EventsScreen from '../Screens/EventsScreen';
import HelplineScreen from '../Screens/HelplineScreen';
import NearbyDetailsViewScreen from '../Screens/NearbyDetailsViewScreen';
import { StyleSheet, } from 'react-native';

const HomeStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function HomeNavigator({ navigation }) {
    return(
        <HomeStack.Navigator initialRouteName={INITIAL_ROUTE_NAME} headerMode="none">
        <HomeStack.Screen
            name="Home"
            component={PatientHomeScreen}
            options={{
                title: 'Home',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
            }}
            /> 
        <HomeStack.Screen
        name="NearbyListView"
        component={NearbyListViewScreen}
        options={{
            title: 'NearbyListView',
            tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
        }}
        /> 
        <HomeStack.Screen
            name="NearbyDetailsView"
            component={NearbyDetailsViewScreen}
            options={{
                title: 'NearbyDetailsView',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
            }}
        /> 
        <HomeStack.Screen
            name="Events"
            component={EventsScreen}
            options={{
                title: 'Events',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="ios-book" />,
            }}
        />
        <HomeStack.Screen
            name="Helpline"
            component={HelplineScreen}
            options={{
                title: 'Helpline',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="ios-book" />,
            }}
        />  
    </HomeStack.Navigator> 
    );    
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      resizeMode: 'cover',
      alignContent: 'center',
    },
  });