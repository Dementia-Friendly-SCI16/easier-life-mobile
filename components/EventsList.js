import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ActivityIndicator, FlatList, Image } from 'react-native';
import {eventsSearchURL, eventsURL, } from '../constants/ApiUrl';
import { Body, Right, Button, Card, CardItem, Left, Input, Icon } from 'native-base';
import { FontAwesome5, Entypo, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking } from 'expo';
import { useNavigation } from '@react-navigation/native';

export default function EventsList(props) {

    const navigation = useNavigation();
    const [search, setSearchQ] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [fetchURL, setFetchURL] = useState(eventsURL);
    let addressUrl = "";

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic ZWFzaWVybGlmZTp0N2RycjZoanJ3bmo=");

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    useEffect(() => {
        setLoading(true);

        fetch(fetchURL, requestOptions)
        .then((response) => response.json())
        .then((json) =>   setData(json.events))
        .catch((error) => console.error(error))
        .finally(() => {
          setLoading(false)
        }
        );

    }, [fetchURL]);

    const getAddressUrl = (address) => {
      addressUrl = "";
      addressUrl = address.replace(/ /g, "+");
      addressUrl  = addressUrl.replace(/,/g, "%2c");
      Linking.openURL("https://www.google.com/maps/search/?api=1&query="+addressUrl);
    }

  return (
    <View style={styles.container}>  
      <View style={{flexDirection:"row", backgroundColor: 'white'}}> 
        <Input
          placeholder="Search Events Here"
          placeholderTextColor="#80808050"
          autoCorrect={true}
          autoCapitalize="none"                                    
          onChangeText={(search) => setSearchQ(search)}
        />
        <Button transparent active
            onPress={()=> setFetchURL(eventsSearchURL + search) }>
            <Icon name = "md-search"/>
        </Button>
      </View>      
        
        {isLoading ? <ActivityIndicator/> : (
          data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <>
              <Card>
                <CardItem header button 
                onPress={() => Linking.openURL(item.url)}>
                <Body>
                    <Text style={styles.header}>{item.name}</Text>
                </Body>
                <Right>
                    <Button transparent
                    onPress={() => Linking.openURL(item.url)}>
                        <FontAwesome5 name="angle-right" size={20} color="#2e5c9a" />
                    </Button>                    
                </Right>                    
                </CardItem>
                <CardItem button onPress={() => Linking.openURL(item.url)}>
                <Body>
                     <Image source={{uri: item.images.images[0].transforms.transforms[item.images.images[0].transforms.transforms.length -1].url}} style={styles.image}></Image>
                </Body>
                </CardItem>
                <CardItem button onPress={() => Linking.openURL(item.url)}>
                <Body>
                    <Text note style={styles.details}>{item.description}</Text>
                </Body>
                </CardItem>
                <CardItem button onPress={() => Linking.openURL(item.url)}>
                <Body>
                    <View style={{flexDirection:"row"}}> 
                    <MaterialIcons name="sort" color='#2e5c9a' size={30}/>
                    <Text>       </Text>
                    <Text note style={styles.details}>{item.category.name}</Text>
                    </View>
                </Body>
                <Right>
                    <View style={{flexDirection:"row"}}> 
                    <Entypo name="hand" color='#2e5c9a' size={30}/>
                    <Text>       </Text>
                    <Text note style={styles.details}>{item.restrictions}</Text>
                    </View>
                </Right>
                </CardItem>
                <CardItem button onPress={() => Linking.openURL(item.url)}>
                <Left>
                    <View style={{flexDirection:"row"}}> 
                    <Entypo name="calendar" color='#2e5c9a' size={30}/>
                    <Text>       </Text>
                    <Text note style={styles.details}>{item.sessions.sessions[0].datetime_summary}</Text>
                    </View>
                </Left>
                </CardItem>
                <CardItem button onPress={() => getAddressUrl(item.address)}>
                  <Body> 
                    <View style={{flexDirection:"row"}}> 
                        <Entypo name="location-pin" size={30} color="#2e5c9a" />
                        <Text>       </Text>
                        <Text note style={styles.details}>{item.address}</Text>
                    </View>
                  </Body>
                </CardItem>
                <CardItem button onPress={() => Linking.openURL(item.url)}>
                  <Body>
                <View style={{flexDirection: 'row', marginRight: 10}}>
                        <MaterialCommunityIcons name="web" size={26} color="#2e5c9a" />
                        <Text>       </Text>
                        <Text style={styles.website} 
                        onPress={() => Linking.openURL(item.url)}>{item.name}</Text>  
                    </View>
                    </Body>
                </CardItem>
            </Card>
            </>
          )}
        />
          ) : <Text style={styles.sorry}>Sorry, no data found!</Text>
      ) 
    }
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'center'
  },
  header: {
      fontWeight: 'bold',
      color: '#2e5c9a',
      fontSize: 16
  },
  image: {
    width: '100%',
    height: 150
  },
  details: {
      textAlignVertical: 'center',
      color: 'grey'
  },
  sorry: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 16,
    marginTop: 20
  },
  website: {
    textAlignVertical: 'center',
    color: '#0000FF',
    textDecorationLine: 'underline',
    marginRight: 10
},
});
