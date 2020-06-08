import React, { Component } from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Permissions from 'expo-permissions';
import ScheduleHome from './ScheduleHome';
import CreateTask from './CreateTask';
import TodoStore from '../data/TodoStore';

const ScheduleNavigator = createStackNavigator();
const INITIAL_ROUTE_NAME = 'ScheduleHome';


export default class ScheduleScreen extends Component {
  async componentWillMount() {
    await this._askForCalendarPermissions();
    await this._askForReminderPermissions();
  }

  _askForCalendarPermissions = async () => {
    await Permissions.askAsync(Permissions.CALENDAR);
  };

  _askForReminderPermissions = async () => {
    if (Platform.OS === 'android') {
      return true;
    }

    await Permissions.askAsync(Permissions.REMINDERS);
  };

  render() {
    return (
      <TodoStore>
        <ScheduleNavigator.Navigator initialRouteName={INITIAL_ROUTE_NAME} headerMode="none">
          <ScheduleNavigator.Screen
            name="ScheduleHome"
            component={ScheduleHome}
          /> 
          <ScheduleNavigator.Screen
            name="CreateTask"
            component={CreateTask}
          /> 
        </ScheduleNavigator.Navigator>
      </TodoStore>
    );
  }
}
