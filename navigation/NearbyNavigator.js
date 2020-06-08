import { createStackNavigator } from "@react-navigation/stack";
import * as React from 'react';
import NearbyListViewScreen from '../Screens/NearbyListViewScreen';
import NearbyDetailsViewScreen from '../Screens/NearbyDetailsViewScreen';
import { StyleSheet, } from 'react-native';

const NearbyStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'NearbyListView';

export default function NearbyNavigator({ navigation }) {
    return(
        <NearbyStack.Navigator initialRouteName={INITIAL_ROUTE_NAME} headerMode="none">
        <NearbyStack.Screen
            name="NearbyListView"
            component={NearbyListViewScreen}
            options={{
                title: 'NearbyListView',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
            }}
            /> 
        <NearbyStack.Screen
            name="NearbyDetailsView"
            component={NearbyDetailsViewScreen}
            options={{
                title: 'NearbyDetailsView',
                tabBarIcon: ({ focused }) => <IoniconsIcon focused={focused} name="md-home" />,
            }}
            /> 
    </NearbyStack.Navigator> 
    );    
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      resizeMode: 'cover',
      alignContent: 'center',
    },
  });