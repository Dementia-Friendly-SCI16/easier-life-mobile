import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import hospitalURL, {supportURL, agedCareURL, } from '../constants/ApiUrl';
import { Body, Right, Button, Card, CardItem, Left, } from 'native-base';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import { nearbyHospitalsResponse, nearbyParksResponse, nearbyAgedHomesResponse } from '../constants/nearbyResponse';

import { useNavigation } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';

export default function LocationList(props) {

    const navigation = useNavigation();
    
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const latlong = props.latlong != "" ? props.latlong : "-37.877132, 145.045105"; // Default is Monash Uni

    let fetchURL;
    
  useEffect(() => {
    setLoading(true);
    console.log("type", props.type);
    props.type == 1 ? fetchURL = hospitalURL + latlong
    : 
    props.type == 2 ? fetchURL = supportURL + latlong
    :
    props.type == 3 ? fetchURL = agedCareURL + latlong
    :
    fetchURL = "";

    console.log("fetchURL", fetchURL);
    fetch(fetchURL)
      .then((response) => response.json())
      .then((json) =>   setData(json.results))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    // props.type == 1 ? setData(nearbyHospitalsResponse.results)
    // : 
    // props.type == 2 ? setData(nearbyParksResponse.results)
    // :
    // props.type == 3 ? setData(nearbyAgedHomesResponse.results)
    // :
    // setData([]);
    
    // setLoading(false);
  }, [props.type, props.latlong]);

  return (
    <View style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
          data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <>
              <Card>
                <CardItem header button onPress={() => navigation.navigate("NearbyDetailsView",{place_id: item.place_id})}>
                <Body>
                    <Text style={styles.header}>{item.name}</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <FontAwesome5 name="angle-right" size={20} color="#2e5c9a" />
                    </Button>                    
                </Right>                    
                </CardItem>
                <CardItem button onPress={() => navigation.navigate("NearbyDetailsView",{place_id: item.place_id})}>
                  <Body> 
                    <View style={{flexDirection:"row"}}> 
                      <Entypo name="location-pin" size={25} color="#2e5c9a" />
                      {
                      item.vicinity !== undefined ? 
                        <Text note style={styles.details}>    {item.vicinity}</Text>
                        : 
                        <Text note style={styles.details}>      Not Available</Text>
                      } 
                    </View>
                  </Body>
                </CardItem>
                <CardItem button onPress={() => navigation.navigate("NearbyDetailsView",{place_id: item.place_id})}>
                    <Body> 
                            
                        <View style={{flexDirection:"row"}}> 
                            <FontAwesome5 name="business-time" size={20} color="#2e5c9a" />
                            {
                            item.opening_hours !== undefined ? 
                            (
                                item.opening_hours.open_now ? 
                                <Text note style={styles.open}>     Open Now</Text>
                                :
                                <Text note style={styles.closed}>     Closed Now</Text>
                            )                            
                            : <Text note style={styles.details}>      Not Available</Text>
                            } 
                        </View>               
                    </Body>
                    <Right>
                            <View style={{flexDirection:"row"}}>  
                            {
                                typeof(item.rating) === 'number' ?
                                <>
                                    {
                                        item.rating === parseInt(item.rating, 10) ? 
                                        <Text note style={styles.details}>({item.rating}.0)    </Text>  
                                        :
                                        <Text note style={styles.details}>({item.rating})    </Text>  
                                    }
                                    <StarRating
                                        fullStarColor = "#fcba03"
                                        halfStarColor = "#fcba03"
                                        starSize = {20}
                                        disabled={true}
                                        maxStars={5}
                                        rating={item.rating}
                                    /> 
                                </>
                                :   <Text note style={styles.details}>No reviews</Text> 
                            }                              
                            </View> 
                        </Right>   
                </CardItem>
              </Card>
            </>
          )}
        />
                          ) : <Text style={styles.error}>Sorry! No relevant places found {"\n"}Try again later!</Text>
      )}
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
  viewDetails: {
      fontWeight: 'bold',
      color: '#2e5c9a',
      textAlignVertical: 'bottom'
  },
  details: {
      textAlignVertical: 'center',
      color: 'grey'
  },
  error: {
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
    fontSize: 16,
  },
  open:{
    textAlignVertical: 'center',
    color: 'green'
  },
  closed:{
    textAlignVertical: 'center',
    color: '#db6e6e'
  }
});