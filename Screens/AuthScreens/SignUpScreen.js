import React, {useState} from "react";
import { Text, StyleSheet, View, Image, Dimensions } from "react-native";
import { Form, Input, Item, Button, Label, Card, } from 'native-base';
import {AuthContext} from '../../context/auth-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {

    const [cEmail, setCEmail] = useState(null);
    const [cPassword, setCPassword] = useState(null);
    const [pEmail, setPEmail] = useState(null);
    const [pPassword, setPPassword] = useState(null);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#fefefe', '#2f95dc', '#2e5c9a']}
        style={styles.gradient}/>
      <View style={styles.logoView}>
        <Image style={styles.logo} source={require('../../assets/images/logo.png')} /> 
        <Text style={styles.logoText}>  EASIER LIFE</Text>
      </View>

      <View>
        <Text style={styles.welcomeTextBold}>Welcome Caregiver!</Text>
        <Text style={styles.welcomeText}>Register yourself and your loved one here</Text>
      </View>
      
      <Form>
        <Text style={styles.instructions}>Enter your details </Text>
        <Item floatingLabel style={styles.item}>
          <Label style={styles.label}>Email</Label>
          <Input
                style={{color:"white"}}
                autoCorrect={false}
                autoCapitalize="none"                                    
                onChangeText={(cEmail) => setCEmail(cEmail)}
            />
        </Item>
        <Item floatingLabel style={styles.item}>
          <Label style={styles.label}>Password</Label>
          <Input
                style={{color:"white"}}
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(cPassword) => setCPassword(cPassword)}
            />
        </Item>   

        <Text style={styles.instructions}>Enter the details of your loved one</Text>
        <Item floatingLabel style={styles.item}>
          <Label style={styles.label}>Their Email</Label>
          <Input
                style={{color:"white"}}
                autoCorrect={false}
                autoCapitalize="none"                                    
                onChangeText={(pEmail) => setPEmail(pEmail)}
            />
        </Item>
        <Item floatingLabel style={styles.item}>
          <Label style={styles.label}>Their Password</Label>
          <Input
                style={{color:"white"}}
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"                                   
                onChangeText={(pPassword) => setPPassword(pPassword)}
            />
        </Item>                
      </Form> 

      <AuthContext.Consumer>  
        {(value) => 
        <>
        <Text style={styles.error}>{value.error}</Text>
        <Button  
            onPress={()=>value.signUp(cEmail, cPassword, "C", pEmail, pPassword)}
            style={styles.button}>
            <Text style={styles.loginText}>CREATE ACCOUNT</Text>
        </Button> 
        
        </>
        } 
      </AuthContext.Consumer> 

      <View style={styles.login}>
          <Text style={{color:"white", textAlignVertical: 'bottom', }}>Already have an account?    </Text>
              <Text style={{color:"white", fontWeight: 'bold', fontSize: 16 }}
              onPress={() => navigation.goBack()}>LOG IN</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent:"center",
    padding: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('screen').height
  },
  image: {
    resizeMode: "contain",
    justifyContent: "center",
    width: null, 
    backgroundColor: "transparent",
  },
  button: {
    marginHorizontal: 50,
    marginTop: 50,
    padding: 10,     
    backgroundColor: 'white',
    borderColor: '#FFF',
    borderStyle: 'solid',
    justifyContent: 'center'
  },
  instructions: {
    color:"white", 
    textAlignVertical: 'bottom', 
    marginTop: 20, 
    fontSize: 16, 
    marginHorizontal: 20, 
    marginBottom: -10
  },
  logo: {
    width: 48,
    height: 55,
  },
  logoText: {
    fontSize: 37,
    fontWeight: 'bold',
    color: '#2e5c9a',
  },
  loginText:{
    color:"#2e5c9a",
    alignSelf: 'center', 
    fontWeight: 'bold'
  },
  item:{      
    backgroundColor:'rgba(46, 92, 154, 0.5)',
    padding: 5,
    margin: 10,
    marginBottom: 2,
    borderRadius: 5    
  },
  login: {
    flexDirection: 'row', 
    alignContent: 'center', 
    justifyContent: 'center', 
    marginTop: 10,
    marginHorizontal: 50,
  },
  logoView: {
    flexDirection: 'row', 
    alignContent: 'center', 
    justifyContent: 'center', 
    marginBottom: 30,
  },
  label: {
    color:"#FFFFFF99", 
    fontWeight: "bold", 
    paddingHorizontal: 10 
  },
  error: {
    color:"white", 
    marginHorizontal: 20
  },
  welcomeText: {
    color:"#2e5c9a", 
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20
  },
  welcomeTextBold: {
    color:"#2e5c9a", 
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold'
  }

});