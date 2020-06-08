# Easier Life
A React Native mobile application to assist caretakers of people with Dementia by way of tracking them, scheduling their day and setting reminders.
It uses React Native Expo, Google Firebase, Google Places API, Event Finda API.

##### Target Audience
  Our target audience is different types of caregivers such as family members as well as professional caregivers, and early-stage      people with dementia themselves who are 65 to 75 years old.

##### Future Prospects
   1. Geofencing, which allows the caregivers to set boundaries for their care receivers and loved ones. 
   2. Allowing more user control to add/remove care receivers and caregivers by themselves.
   

## Demo application using Expo Client [HERE](https://expo.io/@ugan0001/easier-life)


## App Reproduction Steps
- ##### Clone repository
```
git clone https://github.com/Dementia-Friendly-SCI16/easier-life
```
- ##### Open the project in a code editor of your choice. I prefer Visual Studio Code.
- ##### Install all the dependencies using
```
npm install
```
Please note, if you do not already have node installed on your machine, please follow the below instructions [here](https://nodejs.org/en/download/package-manager/).

- ##### Set up Google cloud project
  - Part a: The application uses Places API, Maps SDK for Android, and Maps SDK for iOS. Thus, follow the steps in this [documentation](https://cloud.google.com/resource-manager/docs/creating-managingprojects) to create a project and get the API Keys for the same.
  - Part b: Get the API key for Places API by following this [documentation](https://developers.google.com/places/web-service/get-api-key). 
  
  Please note: Places API is paid and thus need to be mindfully used. However, Google initially provides you with a $200 USD free credit.
  - Part c: Get the API key for using Maps SDK for Android using this [documentation](https://developers.google.com/maps/documentation/android-sdk/getapi-key).
  - Part d: For utilizing the Google maps on iOS devices, get the API key for using Maps SDK for iOS using this [documentation](https://developers.google.com/maps/documentation/ios-sdk/get-api-key).
  
- ##### In app.json file, substitute key values from
  - Part d. at ios.config. googleMapsApiKey
  - Part c at android.config. googleMaps.apiKey

- ##### Set up Firebase project
  - Since the application is a React Native application, it uses React JS as its framework. Thus, we need to set up our Firebase project for Web. Use this [documentation](https://firebase.google.com/docs/web/setup) to add Firebase to our project.
  - Save the details of the firebase configuration into ./constants/ApiKeys.js file. It should look like this
  
  ```
  var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
  };
  ```
  - Go to the [Firebase console](https://console.firebase.google.com/), select Storage, then click Get started. Follow this [documentation](https://firebase.google.com/docs/storage/web/start)
  - Next, in the Firebase console, go to Authentication menu on the left. 
    - Go to Sign-in method tab and choose Email/Password to enable that mode of authentication.
  - Next, in the Firebase console, go to Database menu on the left.
    - There are two types of databases offered in Firebase: Realtime and Near-real time also known as Firestore.
    - We will be using Realtime database for patient location data and Firestore to store user specific information.
  - Choose Cloud Firestore to set up user collections:
    - users: To store user information like their role, and caretaker email id if the user is a patient.
      - Document ID = user email id
      - Fields =
        - role = can hold only P or C; i.e., Patient or Caretaker
        - caretaker = caretaker’s email address. This field is only present if the user role = P
        
     - caretaker_patient: To store the relationship of caretaker to patient
      - Document ID = caretaker’s email id
      - Fields =
        - patients: It is an array of strings holding patient email address
    - The realtime database will automatically be populated when the patient logs into the system.
- Next, download the google-services.json file from Firebase for your application. Follow this [documentation](http://alphatech.technology/Howto-Entrysrk/Google-Services-Json-bek/) for the same.
- Add this file in the root location of your app directory. Make sure to put it in the root location, otherwise you will need to update the app.json file with the correct location of your file.
- ##### Get the Events API
    - Create Eventfinda API username and password using this [documentation](https://www.eventfinda.com.au/api/v2/index)
    - Create API URL to get the headers and hash value for your URL.
  - Update the API keys from above section and Part b. into the ./constants/ApiUrls.js file.
- ##### Finally, to run the application during development, use the following command
  ```
  expo start
  ```
- ##### When your application is ready to be published to expo.io as a Snack, use the following command
  ```
  expo publish
  ```
- ##### To create an APK, use the following command and choose apk option when prompted
  ```
  expo build:android
  ```
- ##### To create an IPA file for iOS, you need a paid Apple Developer Account. If you do, run the below command. If you don’t, choose simulator option instead and run the application on a simulator.
  ```
  expo build:ios
  ```

   
    
