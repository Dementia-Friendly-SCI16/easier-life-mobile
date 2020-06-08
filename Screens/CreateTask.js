import React, { Component, use } from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  Switch,
  StyleSheet,
  Alert,
  Platform,
  ToastAndroid,
  AsyncStorage
} from 'react-native';
import { Picker, Icon } from 'native-base';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';
import DateTimePicker from 'react-native-modal-datetime-picker';
import uuid from 'uuid';
import { ScheduleContext } from '../context/schedule-context';
import { AuthContext } from '../context/auth-context';
import HeaderComponent from '../components/HeaderComponent';

const { width: vw } = Dimensions.get('window');

const styles = StyleSheet.create({
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  seperator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20,
  },
  notes: {
    color: '#9CAAC4',
    fontSize: 16,
    fontWeight: '600',
  },
  notesContent: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20,
  },
  learn: {
    height: 23,
    backgroundColor: '#F8D557',
    justifyContent: 'center',
    borderRadius: 5,
  },
  eatMeds: {
    height: 23,
    backgroundColor: '#62CCFB',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  readBook: {
    height: 23,
    backgroundColor: '#4CD565',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  title: {
    height: 25,
    borderColor: '#5DD976',
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19,
  },
  taskContainer: {
    height: 510,
    width: 327,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
  },
  calenderContainer: {
    marginTop: 30,
    width: 350,
    height: 350,
    alignSelf: 'center',
  },
  newTask: {
    alignSelf: 'center',
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    marginTop: 60,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#eaeef7',
  },
});

let authContext = null;
export default class CreateTask extends Component { 
  static contextType = AuthContext;

  state = {
    selectedDay: {
      [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
        'DD'
      )}`]: {
        selected: true,
        selectedColor: '#2E66E7',
      },
    },
    currentDay: moment().format(),
    taskText: '',
    notesText: '',
    forPatient: '',
    keyboardHeight: 0,
    visibleHeight: Dimensions.get('window').height,
    isAlarmSet: false,
    alarmTime: moment().format(),
    isDateTimePickerVisible: false,
    timeType: '',
    creatTodo: {},
    createEventAsyncRes: '',
    addAttendeeAsyncRes: '',
  };

  UNSAFE_componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);

    
  }

  componentDidMount() {
    authContext = this.context
    
    console.log(authContext)
    
  }

  _keyboardDidShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      visibleHeight:
        Dimensions.get('window').height - e.endCoordinates.height - 30,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      visibleHeight: Dimensions.get('window').height,
    });
  };

  handleAlarmSet = () => {
    const { isAlarmSet } = this.state;
    this.setState({
      isAlarmSet: !isAlarmSet,
    });
  };

  synchronizeCalendar = async value => {
    const { route } = this.props;
    const { createNewCalendar } = route.params;
    
    const checkCal = (calendar) => {
        return Platform.OS == 'android' ? calendar.ownerAccount == authContext.userEmail : calendar.title == authContext.userEmail
    };
    Calendar.getCalendarsAsync().then(calendars => {
      let calendarId = 0;
      const cal = calendars.find(checkCal);
      cal != undefined ?
        calendarId = cal.id
        :
        ToastAndroid.showWithGravityAndOffset(
          "Calendar not found! \n Please log into your calendar to continue.",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

         if(calendarId != 0){         
          try {
            this._addEventsToCalendar(calendarId).then(createEventAsyncRes => 
              {
                this._addAttendeesToEvents(createEventAsyncRes).then(addAttendeeAsyncRes => {
                  this.setState(
                    {
                      createEventAsyncRes,
                      addAttendeeAsyncRes,
                    },
                    () => {
                      this._handleCreateEventData(value);
                    }
                  );
                })
              });
          } catch (e) {
            console.log("error", e.message);
            Alert.alert(e.message);
          }
         }         
    });
    
  };

  _addEventsToCalendar = async calendarId => {
    const { taskText, notesText, forPatient, alarmTime, isAlarmSet } = this.state;
    const event = {
      title: taskText,
      notes: notesText, //"For " + forPatient + ": " + notesText,
      startDate: moment(alarmTime)
        .add(0, 'm')
        .toDate(),
      endDate: moment(alarmTime)
        .add(10, 'm')
        .toDate(),
      timeZone: Localization.timezone,
      alarms: isAlarmSet? [
        {
          relativeOffset: -5,
          method: 'alert'
        }
      ] : []
    };

    try {
      const createEventAsyncRes = await Calendar.createEventAsync(
        calendarId.toString(),
        event
      );

      return createEventAsyncRes;
    } catch (error) {
      console.log(error);
    }
  };

  _addAttendeesToEvents = async (eventId) => {
    console.log("Inside");
    const { forPatient } = this.state;
    const details = {
      email: forPatient,
      name: forPatient,
      role: Platform.OS == 'android' ? Calendar.AttendeeRole.ATTENDEE : Calendar.AttendeeRole.REQUIRED,
      status: Calendar.AttendeeStatus.ACCEPTED,
      type: Platform.OS == 'ios' ? Calendar.AttendeeType.PERSON : Calendar.AttendeeType.REQUIRED
    };

    try {
      const addAttendeeToEventRes = await Calendar.createAttendeeAsync(
        eventId.toString(),
        details
      );
      console.log("addAttendeeToEventRes",addAttendeeToEventRes);

      return addAttendeeToEventRes;
    } catch (error) {
      console.log(error);
    }
  };
  
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleCreateEventData = async value => {
    const {
      state: {
        currentDay,
        taskText,
        notesText,
        forPatient,
        isAlarmSet,
        alarmTime,
        createEventAsyncRes,
        addAttendeeAsyncRes,
      },
      props: { route, navigation },
    } = this;
    const { updateCurrentTask, currentDate } = route.params;
    const creatTodo = {
      key: uuid(),
      date: `${moment(currentDay).format('YYYY')}-${moment(currentDay).format(
        'MM'
      )}-${moment(currentDay).format('DD')}`,
      todoList: [
        {
          key: uuid(),
          title: taskText,
          notes: notesText, //"For " + forPatient + ": " + notesText,
          patient: forPatient,
          alarm: {
            time: alarmTime,
            isOn: isAlarmSet,
            createEventAsyncRes,
            addAttendeeAsyncRes,
          },
          color: `rgb(${Math.floor(
            Math.random() * Math.floor(256)
          )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
            Math.random() * Math.floor(256)
          )})`,
        },
      ],
      markedDot: {
        date: currentDay,
        dots: [
          {
            key: uuid(),
            color: '#2E66E7',
            selectedDotColor: '#2E66E7',
          },
        ],
      },
    };

    await value.updateTodo(creatTodo);
    await updateCurrentTask(currentDate);
    navigation.goBack();
  };

  _handleDatePicked = date => {
    const { currentDay } = this.state;
    const selectedDatePicked = currentDay;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked)
      .hour(hour)
      .minute(minute);

    this.setState({
      alarmTime: newModifiedDay,
    });

    this._hideDateTimePicker();
  };

  render() {
    const {
      state: {
        selectedDay,
        currentDay,
        taskText,
        visibleHeight,
        notesText,
        forPatient, 
        isAlarmSet,
        alarmTime,
        isDateTimePickerVisible,
      },
      props: { navigation },
    } = this;

    return (
      <ScheduleContext.Consumer>
        {value => (
          <>
            <DateTimePicker
              isVisible={isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode="time"
            />

            <View style={styles.container}>
            <HeaderComponent headerTitle="New Task" notifCount="5" showLogo={false}/>
              
                <ScrollView
                  contentContainerStyle={{
                    paddingBottom: 100,
                  }}
                >
                  <View style={styles.calenderContainer}>
                    <CalendarList
                      style={{
                        width: 350,
                        height: 350,
                      }}
                      current={currentDay}
                      minDate={moment().format()}
                      horizontal
                      pastScrollRange={0}
                      pagingEnabled
                      calendarWidth={350}
                      onDayPress={day => {
                        this.setState({
                          selectedDay: {
                            [day.dateString]: {
                              selected: true,
                              selectedColor: '#2E66E7',
                            },
                          },
                          currentDay: day.dateString,
                          alarmTime: day.dateString,
                        });
                      }}
                      monthFormat="MMMM yyyy"
                      hideArrows
                      markingType="simple"
                      theme={{
                        selectedDayBackgroundColor: '#2E66E7',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#2E66E7',
                        backgroundColor: '#eaeef7',
                        calendarBackground: '#eaeef7',
                        textDisabledColor: '#d9dbe0',
                      }}
                      markedDates={selectedDay}
                    />
                  </View>
                  <View style={styles.taskContainer}>
                    <TextInput
                      style={styles.title}
                      onChangeText={text => this.setState({ taskText: text })}
                      value={taskText}
                      placeholder="What do you need to do?"
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#BDC6D8',
                        marginVertical: 10,
                      }}
                    >
                      Suggestion
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity style={styles.readBook}
                        onPress={() => this.setState({ taskText: "Go for check-up" })}>
                        <Text style={{ textAlign: 'center', fontSize: 14, marginHorizontal: 5}}>
                          Check-ups
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.eatMeds}
                      onPress={() => this.setState({ taskText: "Have medicines" })}>
                        <Text style={{ textAlign: 'center', fontSize: 14, marginHorizontal: 5 }}>
                          Medication
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.learn}
                      onPress={() => this.setState({ taskText: "Go to sleep" })}>
                        <Text style={{ textAlign: 'center', fontSize: 14, marginHorizontal: 5 }}>
                          Sleep
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.notesContent} />
                    <View>
                      <Text style={styles.notes}>Notes</Text>
                      <TextInput
                        style={{
                          height: 25,
                          fontSize: 19,
                          marginTop: 3,
                        }}
                        onChangeText={text =>
                          this.setState({ notesText: text })
                        }
                        value={notesText}
                        placeholder="Enter notes about the task."
                      />
                    </View>
                    <View style={styles.seperator} />
                    <View>
                      <Text style={styles.notes}>For Patient</Text>

                      <AuthContext.Consumer>
                      {
                        authContext => (
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder="Select the patient for this task"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={forPatient}
                            onValueChange={(itemValue, itemIndex) =>
                               {
                                 this.setState({ forPatient: itemValue })
                                }}
                          >
                            <Picker.Item label="Select the patient for this task" value="" />
                            {
                              authContext.
                              myPatients.map(
                                patient => (
                                  <Picker.Item label={patient} value={patient} />
                                )
                              )
                            }
                          </Picker>
                        )
                      }
                    </AuthContext.Consumer>
                      
                    </View>
                    <View style={styles.seperator} />
                    <View>
                      <Text
                        style={{
                          color: '#9CAAC4',
                          fontSize: 16,
                          fontWeight: '600',
                        }}
                      >
                        Time
                      </Text>
                      <TouchableOpacity
                        onPress={() => this._showDateTimePicker()}
                        style={{
                          height: 25,
                          marginTop: 3,
                        }}
                      >
                        <Text style={{ fontSize: 19 }}>
                          {moment(alarmTime).format('h:mm A')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.seperator} />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: '#9CAAC4',
                            fontSize: 16,
                            fontWeight: '600',
                          }}
                        >
                          Alarm
                        </Text>
                      </View>
                      <Switch
                        value={isAlarmSet}
                        onValueChange={this.handleAlarmSet}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    disabled={taskText === ''}
                    style={[
                      styles.createTaskButton,
                      {
                        backgroundColor:
                          taskText === ''
                            ? 'rgba(46, 102, 231,0.5)'
                            : '#2E66E7',
                      },
                    ]}
                    onPress={async () => {
                        await this.synchronizeCalendar(value);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: '#fff',
                      }}
                    >
                      ADD YOUR TASK
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
          </>
        )}
      </ScheduleContext.Consumer>
    );
  }
}
