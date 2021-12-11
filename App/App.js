import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, TextInput, 
         TouchableOpacity, View } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Provider as PaperProvider } from 'react-native-paper';
import { Chip, Surface, Avatar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StateContext from './components/StateContext.js';
import { globalStyles } from './styles/globalStyles.js';
import SignInScreen from './components/SignInScreen.js';
import ProfileScreen from './components/ProfileScreen.js';
import SessionListScreen from './components/SessionListScreen.js';

const data = require('./data.json');




function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necesseary if use this CSS:
  //   white-space: break-spaces; (or pre-wrap)
  // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
  return JSON.stringify(jsonVal, null, 2);
}


const Stack = createNativeStackNavigator();


export default function App() {


  /***************************************************************************
   INITIALIZATION
   ***************************************************************************/

  // State for authentication 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [loggedInUser, setLoggedInUser] = React.useState(null);
  
  const signedInProps = {email,setEmail, password, setPassword,errorMsg, setErrorMsg, loggedInUser,setLoggedInUser, displayStates}

  // State for tutoring sessions




  // State for users & profile
  const [selectedUser, setSelectedUser] = React.useState({
		"UID": 1,
		"name": "Quemby Burke",
    "email":"jliu15@wellesley.edu",
		"classyear": 2024,
		"list": "ECON 226, PSYC101, ENG 224, THST 345",
		"attendedSID": "9, 8"
	}); //for testing




/***************************************************************************
   SESSIONS FUNCTIONALITY CODE
   ***************************************************************************/











/***************************************************************************
   USERS FUNCTIONALITY CODE
   ***************************************************************************/


  










/***************************************************************************
   RENDERING DEBUGGING INFO
   ***************************************************************************/
  
   function displayStates() {
    return (
      <ScrollView style={globalStyles.jsonContainer}>
        <Text style={globalStyles.json}>Selected User: {formatJSON(selectedUser)}</Text>
        <Text style={globalStyles.json}>LoggedIn User: {formatJSON(loggedInUser)}</Text>
        <Text style={globalStyles.json}>Courses: {formatJSON(data.courses.slice(1,3))}</Text>
      </ScrollView>
    );
  }

    /***************************************************************************
   RENDERING SESSIONS TAB
   ***************************************************************************/

  



  /***************************************************************************
   RENDERING PROFILE TAB
   ***************************************************************************/
  //  const colors=['aqua', 'bisque', 'coral', 'crimson', 'fuchsia', 
  //  'gold',  'lime', 'orange', 'pink', 'plum', 'purple',
  //  'salmon', 'teal', 'wheat'];

  //  function colorSelect() {
  //   const [pokemon,setPokemon] = useState();
  //   const [selectedLanguage,setSelectedLanguage] = useState();
  //   const [color,setColor] = useState('plum');
  
  //   return (
  //      <View style={[globalStyles.screen, {backgroundColor: color}]}>
  //        <Picker
  //           style={globalStyles.pickerglobalStyles}
  //           mode='dropdown' // or 'dialog'; chooses mode on Android
  //           selectedValue={color}
  //           onValueChange={(itemValue, itemIndex) => setColor(itemValue)}>
  //           {colors.map(clr => <Picker.Item key={clr} label={clr} value={clr}/>)}
  //        </Picker>
  //      </View>
  //   );
  // }
  
  
  //  function testingUserSelection() {
  //  return (
  //   <View style={[globalStyles.screen]}>
  //     <Picker
  //        style={globalStyles.pickerglobalStyles}
  //        mode='dropdown' // or 'dialog'; chooses mode on Android
  //        selectedValue={selectedUser}
  //        onValueChange={(itemValue, itemIndex) => setSelectedUser(itemValue)}>
  //       <Picker.Item label="Pikachu" value="pikachu" />
  //       <Picker.Item label="Charmander" value="charmander" />
  //       <Picker.Item label="Squirtle" value="Squirtle" />
  //        {/* {fakeUsers.map(user => <Picker.Item key={user.name} label={user.name} value={user.name}/>)} */}
  //     </Picker>
  //   </View>
  //   );
  // }

   function displayPersonalInfo() {
    return (
        <View >
          <Text >Name: {selectedUser.name}</Text>
          <Text >Email: {selectedUser.email}</Text>
          <Text >Class Year: Class of {selectedUser.classyear}</Text>
        </View>
    );
  }


  //A single class chip component
  const CourseItem = props => { return (
      <Chip style={globalStyles.chip}>{props.department + " " + props.number}</Chip>
    );
  }






/***************************************************************************
   TOP LEVEL RENDERING 
   ***************************************************************************/
  //  const signedInProps = { loginPane, displayStates};
   const screenProps = {signedInProps};




   return (
    <StateContext.Provider value={screenProps}>
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
            screenOptions={{ headerStyle: { backgroundColor: 'coral' }}}
            initialRouteName="SignInScreen">
            <Stack.Screen 
            name="SignIn" component={SignInScreen} 
            />
            <Stack.Screen 
            name="Profile" component={ProfileScreen} 
            />
            <Stack.Screen 
            name="SessionList" component={SessionListScreen} 
            />
       {/* <View style={globalStyles.screen}> */}

        {/* {colorSelect()} */}
        {/* {displayPersonalInfo()} */}
          {/* <View style={globalStyles.courseContainer}> */}
          {/* {data.courses.slice(1,20).map(course => <CourseItem key={course} department={course.department} number={course.number}></CourseItem>)}
          </View> */}
        {/* {displayStates()} */}
        {/* </View>  */}
        
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    </StateContext.Provider>
  );
}