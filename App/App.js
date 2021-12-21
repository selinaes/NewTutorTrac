import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, LogBox } from "react-native";
import { initializeApp } from "firebase/app";
import {
  // access to authentication features:
  getAuth,
} from "firebase/auth";
import {
  // access to Firestore features:
  getFirestore,
} from "firebase/firestore";
import {
  // access to Firebase storage features (for files like images, video, etc.)
  getStorage,
} from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StateContext from "./components/StateContext.js";
import { globalStyles } from "./styles/globalStyles.js";
import SignInScreen from "./components/SignInScreen.js";
import ProfileScreen from "./components/ProfileScreen.js";
import SessionListScreen from "./components/SessionListScreen.js";

const data = require("./data.json");

const Tab = createBottomTabNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyCtvvMpb2icR7di4hyGnD7Wg76hussiBYk",
  authDomain: "cs317-tutortrac.firebaseapp.com",
  projectId: "cs317-tutortrac",
  storageBucket: "cs317-tutortrac.appspot.com",
  messagingSenderId: "883004559565",
  appId: "1:883004559565:web:765c9894d3dbcfc0b19984",
  measurementId: "G-ZK9YEKDBDT",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); // *** new for Firestore
const storage = getStorage(firebaseApp, "cs317-tutortrac.appspot.com"); // for storaging images in Firebase storage

LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage", // While we're at it, squelch AyncStorage, too!
]);

function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necessary if use this CSS:
  //   white-space: break-spaces; (or pre-wrap)
  // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
  return JSON.stringify(jsonVal, null, 2);
}

export default function App() {
  /***************************************************************************
   INITIALIZATION
   ***************************************************************************/

  // Shared state for authentication
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  // Shared state for firestore data
  const [users, setUsers] = React.useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [courses, setCourses] = React.useState([]);

  // State for users & profile
  const [selectedUser, setSelectedUser] = React.useState(data.users[0]); // React.useState(loggedInUserProfile? loggedInUserProfile:data.users[0]); //for testing

  const signedInProps = {
    email,
    setEmail,
    password,
    setPassword,
    loggedInUser,
    setLoggedInUser,
    displayStates,
    selectedUser,
    setSelectedUser,
  };

  const firestoreProps = {
    users,
    setUsers,
    sessions,
    setSessions,
    courses,
    setCourses,
  };

  const firebaseProps = { auth, db, storage };
  const profileProps = { selectedUser, setSelectedUser };
  const sessionsProps = { selectedUser, setSelectedUser };
  const selectedProps = data.sessions[0];

  /***************************************************************************
   RENDERING DEBUGGING INFO
   ***************************************************************************/

  function displayStates() {
    return (
      <ScrollView style={globalStyles.jsonContainer}>
        <Text style={globalStyles.json}>
          Selected User: {formatJSON(selectedUser)}
        </Text>
        <Text style={globalStyles.json}>
          LoggedIn User: {formatJSON(loggedInUser)}
        </Text>
        <Text style={globalStyles.json}>
          Courses: {formatJSON(data.courses.slice(1, 3))}
        </Text>
      </ScrollView>
    );
  }

  /***************************************************************************
   TOP LEVEL RENDERING
   ***************************************************************************/

  const screenProps = {
    signedInProps,
    profileProps,
    sessionsProps,
    selectedProps,
    firebaseProps,
    firestoreProps,
  };

  return (
    <StateContext.Provider value={screenProps}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "coral" },
              headerShown: false,
            }}
            initialRouteName="Sessions"
          >
            <Tab.Screen name="Info" component={SignInScreen} />
            <Tab.Screen name="Sessions" component={SessionListScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StateContext.Provider>
  );
}
