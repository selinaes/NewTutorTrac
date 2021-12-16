import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StateContext from "./components/StateContext.js";
import { globalStyles } from "./styles/globalStyles.js";
import SignInScreen from "./components/SignInScreen.js";
import ProfileScreen from "./components/ProfileScreen.js";
import SessionListScreen from "./components/SessionListScreen.js";

const data = require("./data.json");

function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necessary if use this CSS:
  //   white-space: break-spaces; (or pre-wrap)
  // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
  return JSON.stringify(jsonVal, null, 2);
}

const Tab = createBottomTabNavigator();

export default function App() {
  /***************************************************************************
   INITIALIZATION
   ***************************************************************************/

  // State for authentication
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  // State for tutoring sessions

  // State for users & profile
  const [selectedUser, setSelectedUser] = React.useState(data.users[0]); // React.useState(loggedInUserProfile? loggedInUserProfile:data.users[0]); //for testing

  const signedInProps = {
    email,
    setEmail,
    password,
    setPassword,
    errorMsg,
    setErrorMsg,
    loggedInUser,
    setLoggedInUser,
    displayStates,
    selectedUser,
    setSelectedUser,
  };

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
