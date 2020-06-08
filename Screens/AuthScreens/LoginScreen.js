import React, {useState} from "react";
import { Text, StyleSheet, View, Image, Dimensions } from "react-native";
import { Form, Input, Item, Button, Label, Card, Icon} from 'native-base';
import {AuthContext} from '../../context/auth-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [icon, setIcon] = useState("eye");
  const [showPassword, setShowPassword] = useState(true);

  const _changeIcon = () => {
    setIcon(icon === "eye" ? "eye-off" : "eye");
    setShowPassword(!showPassword);
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#fefefe', '#2f95dc', '#2e5c9a']}
        style={styles.gradient}/>
      <View style={styles.logoView}>
        <Image style={styles.logo} source={require('../../assets/images/logo.png')} /> 
        <Text style={styles.logoText}>  EASIER LIFE</Text>
      </View>
      
      <Form style={styles.form}>
        <Item floatingLabel style={styles.item}>
          <Label style={styles.label}>Email</Label>
          <Input
              style={{color:"white"}}
              autoCorrect={false}
              autoCapitalize="none"                                    
              onChangeText={(email) => setEmail(email)}
          />
        </Item>
        <Item floatingLabel style={styles.item}>
          <Label style={styles.label}>Password</Label>
          <Input
              style={{color:"white"}}
              secureTextEntry={showPassword}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(password) => setPassword(password)}
          />
          <Icon name={icon} onPress={() => _changeIcon()} style={styles.label}/>
        </Item>                
      </Form> 

      <AuthContext.Consumer>  
        {(value) => 
        <>
        <Text style={styles.error}>{value.error}</Text>
        <Button  
            onPress={()=>value.login(email,password)}
            //onPress={()=>value.login("urmisubs@gmail.com","easy123")}
            style={styles.button}>
            <Text style={styles.loginText}>LOG IN</Text>
        </Button> 
        
        </>
        } 
      </AuthContext.Consumer> 

        <View style={styles.signup}>
          <Text style={{color:"white", textAlignVertical: 'bottom', }}>Don't have an account yet?    </Text>
              <Text style={{color:"white", fontWeight: 'bold', fontSize: 16 }}
              onPress={() => navigation.navigate("SignUp")}>SIGN UP</Text>
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
    borderRadius: 5
    
  },
  signup: {
    flexDirection: 'row', 
    alignContent: 'center', 
    justifyContent: 'center', 
    marginTop: 100,
    marginHorizontal: 50,
  },
  logoView: {
    flexDirection: 'row', 
    alignContent: 'center', 
    justifyContent: 'center', 
    marginBottom: 75,
  },
  label: {
    color:"#FFFFFF99", 
    fontWeight: "bold", 
    paddingHorizontal: 10 
  },
  error: {
    color:"white", 
    marginHorizontal: 20
  }

});