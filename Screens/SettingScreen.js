import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';
import {AuthContext} from '../context/auth-context';
import { Container, Content } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const CARETAKER = "C";

export default function SettingScreen() {
  const navigation = useNavigation();

  return (
    <Container>
      <HeaderComponent headerTitle="Settings" notifCount="5" showLogo={false}/>
      <Content>
      <AuthContext.Consumer>  
          {(context) =>       
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {
            context.userRole == CARETAKER ?
            <OptionButton
              icon="ios-book"
              label="Resources"
              onPress={() => navigation.navigate("Resources")}
            /> : false}

            <OptionButton
              icon="md-headset"
              label="Helpline"
              onPress={() => navigation.navigate("Helpline")}
            />
            <OptionButton
              icon="md-exit"
              label="Logout"
              onPress={() => context.logout()}
              isLastOption
            />
          </ScrollView>
          }
        </AuthContext.Consumer> 
      </Content>
    </Container>
    
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});