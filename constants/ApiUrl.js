import {placesAPIKey} from './ApiKeys';

//Parks
export const supportURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=10000&keyword=counselling, therapy, dementia&key="+ placesAPIKey +"&location=";
//-37.888086,145.041671

//Aged Care
export const agedCareURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=10000&keyword=dementia, senior citizen center, aged care, community&key="+ placesAPIKey +"&location=";
//-37.888086,145.041671

//Hospitals
export default hospitalURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=10000&keyword=hospital, doctor, nurse, infirmary&key="+ placesAPIKey +"&location=";
//-37.888086,145.041671

//Details:
export const detailsURL = "https://maps.googleapis.com/maps/api/place/details/json?fields=name,geometry,formatted_address,url,formatted_phone_number,opening_hours,website,rating,review,user_ratings_total&key="+ placesAPIKey +"&place_id=";
//ChIJpwg9hiRq1moRkdKXtEtDM_o

//Events:
export const eventsURL = "http://api.eventfinda.com.au/v2/events.json?order=date&row=20&location=4&q=alzheimer, mental health, old age, senior citizen, old people, dementia, family, grandparent, mind, body, health";

//Events Search:
export const eventsSearchURL = "http://api.eventfinda.com.au/v2/events.json?order=date&row=20&location=4&q=";

//Old->"+ placesAPIKey +"