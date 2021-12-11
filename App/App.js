import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, TextInput, 
         TouchableOpacity, View } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Provider as PaperProvider } from 'react-native-paper';
import { Chip, Surface, Avatar } from 'react-native-paper';
// import { initializeApp } from "firebase/app";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StateContext from './components/StateContext.js';
import { globalStyles } from './styles/globalStyles.js';
import SignInScreen from './components/SignInScreen.js';
// import { // access to authentication features:
//          getAuth, 
//          // for email/password authentication: 
//          createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
//          // for logging out:
//          signOut
//   } from "firebase/auth";
const data = require('./data.json');



// const firebaseConfig = {
//   apiKey: "AIzaSyCtvvMpb2icR7di4hyGnD7Wg76hussiBYk",
//   authDomain: "cs317-tutortrac.firebaseapp.com",
//   projectId: "cs317-tutortrac",
//   storageBucket: "cs317-tutortrac.appspot.com",
//   messagingSenderId: "883004559565",
//   appId: "1:883004559565:web:765c9894d3dbcfc0b19984",
//   measurementId: "G-ZK9YEKDBDT"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);

function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necesseary if use this CSS:
  //   white-space: break-spaces; (or pre-wrap)
  // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
  return JSON.stringify(jsonVal, null, 2);
}

// function emailOf(user) {
//   if (user) {
//     return user.email;
//   } else {
//     return null;
//   }
// }

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



  // // component mount and unmount
  // useEffect(() => {
  //     // Anything in here is fired on component mount.
  //     console.log('Component did mount');
  //     console.log(`on mount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
  //     console.log(`on mount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
  //     checkEmailVerification();
  //     return () => {
  //       // Anything in here is fired on component unmount.
  //       console.log('Component did unmount');
  //       console.log(`on unmount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
  //       console.log(`on unmount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
  //     }
  //   }, [])



// /***************************************************************************
//    AUTHENTICATION CODE

//    ***************************************************************************/
//   // Clear error message when email is updated to be nonempty
//   useEffect(
//     () => { if (email != '') setErrorMsg(''); },
//     [email]
//   );

//   function signUpUserEmailPassword() {
//     console.log('called signUpUserEmailPassword');
//     if (auth.currentUser) {
//       signOut(auth); // sign out auth's current user (who is not loggedInUser, 
//                      // or else we wouldn't be here
//     }
//     if (!email.includes('@')) {
//       setErrorMsg('Not a valid email address');
//       return;
//     }
//     if (password.length < 6) {
//       setErrorMsg('Password too short');
//       return;
//     }
//     // Invoke Firebase authentication API for Email/Password sign up 
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         console.log(`signUpUserEmailPassword: sign up for email ${email} succeeded (but email still needs verification).`);

//         // Clear email/password inputs
//         const savedEmail = email; // Save for email verification
//         setEmail('');
//         setPassword('');

//         // Note: could store userCredential here if wanted it later ...
//         // console.log(`createUserWithEmailAndPassword: setCredential`);
//         // setCredential(userCredential);

//         // Send verication email
//         console.log('signUpUserEmailPassword: about to send verification email');
//         sendEmailVerification(auth.currentUser)
//         .then(() => {
//             console.log('signUpUserEmailPassword: sent verification email');
//             setErrorMsg(`A verification email has been sent to ${savedEmail}. You will not be able to sign in to this account until you click on the verification link in that email.`); 
//             // Email verification sent!
//             // ...
//           });
//       })
//       .catch((error) => {
//         console.log(`signUpUserEmailPassword: sign up failed for email ${email}`);
//         const errorMessage = error.message;
//         // const errorCode = error.code; // Could use this, too.
//         console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
//         setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
//       });
//   }

//   function signInUserEmailPassword() {
//     console.log('called signInUserEmailPassword');
//     console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(auth.currentUser)}`); 
//     console.log(`signInUserEmailPassword: emailOf(loggedInUser)0=${emailOf(loggedInUser)}`); 
//     // Invoke Firebase authentication API for Email/Password sign in 
//     // Use Email/Password for authentication 
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         console.log(`signInUserEmailPassword succeeded for email ${email}; have userCredential for emailOf(auth.currentUser)=${emailOf(auth.currentUser)} (but may not be verified)`); 
//         console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(auth.currentUser)}`); 
//         console.log(`signInUserEmailPassword: emailOf(loggedInUser)1=${emailOf(loggedInUser)}`); 

//         // Only log in auth.currentUser if their email is verified
//         checkEmailVerification();

//         // Clear email/password inputs 
//         setEmail('');
//         setPassword('');

//         // Note: could store userCredential here if wanted it later ...
//         // console.log(`createUserWithEmailAndPassword: setCredential`);
//         // setCredential(userCredential);
    
//         })
//       .catch((error) => {
//         console.log(`signUpUserEmailPassword: sign in failed for email ${email}`);
//         const errorMessage = error.message;
//         // const errorCode = error.code; // Could use this, too.
//         console.log(`signInUserEmailPassword: ${errorMessage}`);
//         setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
//       });
//   }

//   function checkEmailVerification() {
//     if (auth.currentUser) {
//       console.log(`checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`);
//       if (auth.currentUser.emailVerified) {
//         console.log(`checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`);
//         setLoggedInUser(auth.currentUser);
//         console.log("checkEmailVerification: setErrorMsg('')")
//         setErrorMsg('')
//       } else {
//         console.log('checkEmailVerification: remind user to verify email');
//         setErrorMsg(`You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
//       }
//     }
//   }

//   function logOut() {
//     console.log('logOut'); 
//     console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
//     console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
//     console.log(`logOut: setLoggedInUser(null)`);
//     setLoggedInUser(null);
//     console.log('logOut: signOut(auth)');
//     signOut(auth); // Will eventually set auth.currentUser to null     
//   }




/***************************************************************************
   SESSIONS FUNCTIONALITY CODE
   ***************************************************************************/











/***************************************************************************
   USERS FUNCTIONALITY CODE
   ***************************************************************************/


  









  // /***************************************************************************
  //  RENDERING AUTHENTICATION
  //  ***************************************************************************/

  //  function loginPane() {
  //   return (
  //     <View style={loggedInUser === null ? globalStyles.loginLogoutPane : globalStyles.hidden}>
  //       <View style={globalStyles.labeledInput}>
  //         <Text style={globalStyles.inputLabel}>Email:</Text>
  //         <TextInput placeholder="Enter an email address" 
  //           style={globalStyles.textInput} 
  //           value={email} 
  //           onChangeText={ textVal => setEmail(textVal)} />
  //       </View>
  //       <View style={globalStyles.labeledInput}>
  //         <Text style={globalStyles.inputLabel}>Password:</Text>
  //         <TextInput placeholder="Enter a password" 
  //           style={globalStyles.textInput} 
  //           value={password} 
  //           onChangeText={ textVal => setPassword(textVal)} />
  //       </View>
  //       <View style={globalStyles.buttonHolder}>
  //         <TouchableOpacity style={globalStyles.button}
  //            onPress={() => signUpUserEmailPassword()}>
  //           <Text style={globalStyles.buttonText}>Sign Up</Text>
  //         </TouchableOpacity> 
  //         <TouchableOpacity style={globalStyles.button}
  //            onPress={() => signInUserEmailPassword()}>
  //           <Text style={globalStyles.buttonText}>Sign In</Text>
  //         </TouchableOpacity> 
  //       </View>
  //       <View style={errorMsg === '' ? globalStyles.hidden : globalStyles.errorBox}>
  //         <Text style={globalStyles.errorMessage}>{errorMsg}</Text>
  //       </View>
  //     </View>
  //   );
  // }

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
       {/* <View style={globalStyles.screen}> */}
        {/* {loginPane()} */}
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