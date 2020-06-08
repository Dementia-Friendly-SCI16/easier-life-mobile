import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { ActivityIndicator, View, StyleSheet, Text, AsyncStorage} from "react-native";
import IoniconsIcon, { EntypoIcon } from '../components/TabBarIcon';
//import SettingScreen from '../Screens/SettingScreen';
// import NearbyScreen from '../Screens/NearbyScreen';
import NearbyNavigator from '../navigation/NearbyNavigator';
import HomeNavigator from '../navigation/HomeNavigatior';
import PatientHomeNavigator from '../navigation/PatientHomeNavigator';
import PatientScheduleScreen from '../Screens/PatientScheduleScreen';
import ScheduleScreen from '../Screens/ScheduleScreen';
import {AuthContext} from '../context/auth-context';
import SettingsNavigator from './SettingsNavigator';
import EventsScreen from '../Screens/EventsScreen';


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';
const CARETAKER = "C";
const PATIENT = "P";
export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    
      <AuthContext.Consumer>
        {
          (context) => 
          
            context.userRole == CARETAKER
            ? (
              <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
                <BottomTab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                  title: 'Home',
                  tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
                }}
              />   
              <BottomTab.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{
                  title: 'Schedule',
                  tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-calendar" />,
                }}
              />
              <BottomTab.Screen
                name="Nearby"
                component={NearbyNavigator}
                options={{
                  title: 'Nearby',
                  tabBarIcon: ({ focused }) => <EntypoIcon focused={focused} name="direction" />,
                }}
              />
              <BottomTab.Screen
                name="Events"
                component={EventsScreen}
                options={{
                  title: 'Events',
                  tabBarIcon: ({ focused }) => <EntypoIcon focused={focused} name="ticket" />,
                }}
              />
              <BottomTab.Screen
                name="Settings"
                component={SettingsNavigator}
                options={{
                  title: 'Settings',
                  tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-settings" />,
                }}
              />
             </BottomTab.Navigator>
            ) 
            : context.userRole == PATIENT ? 
            ( 
              <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
                <BottomTab.Screen
                  name="Home"
                  component={PatientHomeNavigator}
                  options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
                  }}
                /> 
                <BottomTab.Screen
                name="Nearby"
                component={NearbyNavigator}
                options={{
                  title: 'Nearby',
                  tabBarIcon: ({ focused }) => <EntypoIcon focused={focused} name="direction" />,
                }}
                />
                {/* <BottomTab.Screen
                  name="Schedule"
                  component={PatientScheduleScreen}
                  options={{
                    title: 'Schedule',
                    tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
                  }}
                />  */}
                <BottomTab.Screen
                  name="Settings"
                  component={SettingsNavigator}
                  options={{
                    title: 'Settings',
                    tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-settings" />,
                  }}
                />
              </BottomTab.Navigator>
            ) 
            : (
              
                <View style={styles.container}>
                  <ActivityIndicator size="large" color="black" />  
                  <Text style={styles.waiting}>Logging in...</Text>   
                  </View> 
            )
        }
      </AuthContext.Consumer>
      
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Easier Life';
    case 'Tracking':
      return 'Tracking';
    case 'Nearby':
      return 'Nearby';
    case 'Settings':
      return 'Settings';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignContent: 'center',
    opacity:0.7,
  },
  waiting: {
    textAlign: 'center',
    alignContent: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
