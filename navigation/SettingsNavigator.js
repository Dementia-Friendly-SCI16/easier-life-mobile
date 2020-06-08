import { createStackNavigator } from "@react-navigation/stack";
import * as React from 'react';
import ResourcesScreen from '../Screens/ResourcesScreen';
import SettingScreen from '../Screens/SettingScreen';
import HelplineScreen from '../Screens/HelplineScreen';
import { StyleSheet, } from 'react-native';

const SettingsStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Settings';

export default function SettingsNavigator({ navigation }) {
    return(
        <SettingsStack.Navigator initialRouteName={INITIAL_ROUTE_NAME} headerMode="none">
        <SettingsStack.Screen
            name="Settings"
            component={SettingScreen}
            options={{
                title: 'Settings',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
            }}
            /> 
        <SettingsStack.Screen
            name="Resources"
            component={ResourcesScreen}
            options={{
                title: 'Resources',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
            }}
            /> 
        <SettingsStack.Screen
            name="Helpline"
            component={HelplineScreen}
            options={{
                title: 'Helpline',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
            }}
            /> 
    </SettingsStack.Navigator> 
    );    
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      resizeMode: 'cover',
      alignContent: 'center',
    },
  });