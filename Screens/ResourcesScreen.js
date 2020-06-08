import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';

export default function ResourcesScreen() {
  return ( 
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <HeaderComponent headerTitle="Resources" notifCount="5" showLogo={false}/>
        <OptionButton
            icon="ios-link"
            label="Understanding Dementia Behaviors"
            onPress={() => WebBrowser.openBrowserAsync('https://www.caregiver.org/caregivers-guide-understanding-dementia-behaviors')}
        />

        <OptionButton
            icon="ios-link"
            label="Tips: communicating with someone with dementia"
            onPress={() => WebBrowser.openBrowserAsync('https://www.alzheimers.org.uk/about-dementia/symptoms-and-diagnosis/symptoms/tips-for-communicating-dementia')}
        />

        <OptionButton
            icon="ios-link"
            label="Communication Strategies for Dementia"
            onPress={() => WebBrowser.openBrowserAsync('https://www.aplaceformom.com/blog/communication-with-a-loved-one-with-dementia/')}
        />
        <OptionButton
            icon="ios-link"
            label="Caring for someone with Dementia"
            onPress={() => WebBrowser.openBrowserAsync('https://www.dementia.org.au/files/NATIONAL/documents/Alzheimers-Australia-Numbered-Publication-42.pdf')}
        />
        <OptionButton
            icon="ios-link"
            label="Taking care of carers"
            onPress={() => WebBrowser.openBrowserAsync('https://www.betterhealth.vic.gov.au/health/ConditionsAndTreatments/dementia-taking-care-of-carers')}
        />
        <OptionButton
            icon="ios-link"
            label="Carer respite"
            onPress={() => WebBrowser.openBrowserAsync('https://www.myagedcare.gov.au/short-term-care/respite-care')}
        />
        <OptionButton
            icon="ios-link"
            label="Webinars and education"
            onPress={() => WebBrowser.openBrowserAsync('https://www.dementia.org.au/event-product-types/online-webinars')}
        />
        <OptionButton
            icon="ios-link"
            label="Dementia Care Dos & Don'ts"
            onPress={() => WebBrowser.openBrowserAsync('https://www.aplaceformom.com/blog/dealing-with-dementia-behaviors')}
            isLastOption
        />
    </ScrollView>
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
