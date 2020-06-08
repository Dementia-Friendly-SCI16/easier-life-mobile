import { Ionicons, FontAwesome5, Entypo} from '@expo/vector-icons';
import * as React from 'react';
import Colors from '../constants/Colors';
import { Platform } from 'react-native';

export default function IoniconsIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export function FontAwesome5Icon(props) {
  return (
    <FontAwesome5
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export function EntypoIcon(props) {
  return (
    <Entypo
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export function NotificationIcon(props) {
  return (
    <Ionicons
      name={"md-notifications"}
      size={30}
      style={{ marginBottom: -3 }}
      color="white"
    />
  );
}

export function BackIcon(props) {
  return (
    <Ionicons
      name={"md-arrow-round-back"}
      size={30}
      style={{ marginBottom: -3 }}
      color={Platform.OS == 'ios' ? Colors.iosDefault : 'white'}
    />
  );
}
