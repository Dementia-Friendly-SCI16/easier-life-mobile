import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from "react-native";
import MapView, { Marker, Callout} from 'react-native-maps';
import { Content, Card, CardItem} from 'native-base';
import HeaderComponent from '../components/HeaderComponent';
import { detailsURL } from '../constants/ApiUrl';
import { MaterialCommunityIcons, Zocial, FontAwesome5 } from '@expo/vector-icons';
import { Linking } from 'expo';
import { detailsResponse1, detailsResponse2 } from '../constants/detailsResponse';
import StarRating from 'react-native-star-rating';

export default function NearbyDetailsViewScreen({ route }) {

    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);

    const { place_id } = route.params;

    const { width, height } = Dimensions.get('window');

    const ASPECT_RATIO = width / height;
    const LATITUDE = -37.888289;
    const LONGITUDE = 145.041586;
    const LATITUDE_DELTA = 0.009;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    

    useEffect(() => {
        let fetchURL = detailsURL + place_id;
        setLoading(true);
        fetch(fetchURL)
          .then((response) => response.json())
          .then((json) =>   setData(json.result))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));

        // place_id != "ChIJd0Rb4SJq1moR62fZgK9hVt8" ? 
        //     setData(detailsResponse2.result) : setData(detailsResponse1.result);      
        // setLoading(false);
      }, [route.params]);

    return(
        <View style={styles.container}>          
            <HeaderComponent headerTitle="Place Details" notifCount="5" showLogo={false}/>
                <Content style={styles.content}>
                {isLoading ? <ActivityIndicator/> : (
                    undefined != data ? (
                        <ScrollView>          
                    <MapView
                        //  provider={PROVIDER_GOOGLE} 
                        initialRegion={{
                            latitude: data.geometry.location.lat,//LATITUDE,
                            longitude: data.geometry.location.lng, //LONGITUDE
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        style={styles.mapStyle}
                        onPress={() => Linking.openURL(data.url)}
                        >
                        <Marker
                            coordinate={{
                                latitude: data.geometry.location.lat,//LATITUDE,
                                longitude: data.geometry.location.lng //LONGITUDE
                            }}>
                            <Callout
                            onPress={() => Linking.openURL(data.url)}>
                                <Card>
                                    <CardItem>
                                        <Text style={styles.calloutText}>{data.hasOwnProperty("name") ? data.name : "Location name not found"}</Text>
                                    </CardItem>
                                </Card>                                
                            </Callout>
                        </Marker>
                    </MapView> 

                    <Text style={styles.header}>{data.hasOwnProperty("name") ? data.name : "Location name not found"} {"\n"}</Text>   

                    <View style={{flexDirection: 'row'}}>
                        <MaterialCommunityIcons name="web" size={26} color="#2e5c9a" />
                        <Text>       </Text>
                        <Text style={styles.website} 
                        onPress={() => Linking.openURL(data.website)}>{data.website}</Text>  
                    </View>
                    <View style={styles.seperator} />     
                    
                    <View style={{flexDirection: 'row'}}>
                        <MaterialCommunityIcons name="map-marker-radius" size={26} color="#2e5c9a" />
                        <Text>       </Text>
                        <Text style={styles.details}
                        onPress={() => Linking.openURL(data.url)}>{data.formatted_address}</Text>  
                    </View>
                    <View style={styles.seperator} />    

                    <View style={{flexDirection: 'row'}}>
                        <Zocial name="call" size={26} color="#2e5c9a" />
                        {
                            data.hasOwnProperty("formatted_phone_number") ?
                            <Text style={styles.details}
                            onPress={() => Linking.openURL('tel:+61'+ data.formatted_phone_number)}>       {data.formatted_phone_number}</Text>  
                            :
                            <Text note style={styles.details}>      Contact details not available</Text>
                        }
                        
                    </View>
                    <View style={styles.seperator} /> 

                    <View style={{flexDirection: 'row'}}>
                    <FontAwesome5 name="business-time" size={20} color="#2e5c9a" />
                        {
                            data.opening_hours !== undefined ? 
                            (
                                data.opening_hours.open_now ? 
                                (
                                    <Text note style={styles.open}>     Open Now {"\n"}</Text>
                                )
                                : 
                                    <Text note style={styles.closed}>     Closed Now</Text>
                                )                          
                            : <Text note style={styles.details}>      Opening hours not available</Text>
                        }
                    
                    </View>
                    {
                        data.opening_hours !== undefined ? 
                        (
                            data.opening_hours.weekday_text.map(hours => (
                            <Text style={styles.details}>           {hours}</Text>
                        ))
                        ) : <Text note style={styles.details}>      </Text>
                    } 
                    <View style={styles.seperator} />    

                    <View style={{flexDirection: 'row'}}>                   
                    {
                        typeof(data.rating) === 'number' ?
                        <>
                            {
                                data.rating === parseInt(data.rating, 10) ? 
                                <Text note style={styles.details}>({data.rating}.0)    </Text>  
                                :
                                <Text note style={styles.details}>({data.rating})    </Text>  
                            }
                            <StarRating
                                fullStarColor = "#fcba03"
                                halfStarColor = "#fcba03"
                                starSize = {20}
                                disabled={true}
                                maxStars={5}
                                rating={data.rating}
                            /> 
                        </>
                        :   <Text note style={styles.details}>No reviews</Text> 
                    }  
                     </View>
                     <View style={{ marginVertical: 10 }} /> 
                    </ScrollView>
                
                    ) : <Text style={styles.error}>Sorry! Details not found {"\n"}Try again later!</Text>
                    )}
            </Content>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        alignContent: 'center',
        backgroundColor: 'white'
    },
    calloutText: {
        color: '#2e5c9a',
        fontSize: 14,
    },
    mapStyle :{
        width: '100%',
        height: 200,
        marginTop: 7,
        shadowColor:'white', 
        borderRadius: 2, 
        shadowOffset: {width:0, height: 10}, 
        shadowOpacity: 0.8, 
    },
    seperator: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#979797',
        alignSelf: 'center',
        marginVertical: 10,
    },
    content: {
        marginHorizontal: 10,
    },
    header: {
        fontWeight: 'bold',
        color: '#2e5c9a',
        fontSize: 24,
        marginTop: 20
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
    website: {
        textAlignVertical: 'center',
        color: '#0000FF',
        textDecorationLine: 'underline'
    },
    open:{
      textAlignVertical: 'center',
      color: 'green',
      marginBottom: 15
    },
    closed:{
      textAlignVertical: 'center',
      color: '#db6e6e',
      marginBottom: 15
    },
    error: {
        textAlignVertical: 'center',
        textAlign: 'center',
        marginTop: 20,
        color: 'grey',
        fontSize: 16,
      },

});