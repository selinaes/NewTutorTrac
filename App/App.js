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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StateContext from "./components/StateContext.js";
import { globalStyles } from "./styles/globalStyles.js";
import SignInScreen from "./components/SignInScreen.js";
import ProfileScreen from "./components/ProfileScreen.js";
import SessionListScreen from "./components/SessionListScreen.js";
import DataDisplayScreen from "./components/DataDisplayScreen.js";

const data = require("./data.json");

function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necessary if use this CSS:
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
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [loggedInUser, setLoggedInUser] = React.useState(null);

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
  };

  // State for tutoring sessions

  // State for users & profile
  const [selectedUser, setSelectedUser] = React.useState({
    UID: 1,
    name: "Quemby Burke",
    email: "qb1@wellesley.edu",
    classyear: 2024,
    courses: [0, 1, 2, 3],
    attendedSID: [8, 9],
  }); //for testing

  const profileProps = { selectedUser, setSelectedUser };
  const sessionsProps = { selectedUser, setSelectedUser };

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

  const screenProps = { signedInProps, profileProps, sessionsProps };

  return (
    <StateContext.Provider value={screenProps}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{ headerStyle: { backgroundColor: "coral" } }}
            initialRouteName="SignInScreen"
          >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SessionList" component={SessionListScreen} />
            <Stack.Screen name="DataDisplay" component={SessionListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StateContext.Provider>
  );
}
