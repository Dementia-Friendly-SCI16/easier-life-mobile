import * as React from 'react';
import { StyleSheet, ImageBackground, View} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import CarerHomeComponent from '../components/CarerHomeComponent';

export default function HomeScreen({ navigation }) {

    return (           
      <View style={styles.container}>          
        <HeaderComponent headerTitle="Easier Life" notifCount="5" showLogo={true}/>
        <CarerHomeComponent/>
      </View>          
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    alignContent: 'center',
  },
});