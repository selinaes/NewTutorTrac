import React, { useState, useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, LogBox } from "react-native";
import { initializeApp } from "firebase/app";
import {
  // access to authentication features:
  getAuth,
  signOut,
} from "firebase/auth";
import {
  // access to Firestore features:
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  // access to Firebase storage features (for files like images, video, etc.)
  getStorage,
} from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import { formatJSON, emailOf } from "./utils";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StateContext from "./components/StateContext.js";
import { globalStyles } from "./styles/globalStyles.js";
import SignInScreen from "./components/SignInScreen.js";
import ProfileScreen from "./components/ProfileScreen.js";
import SessionListScreen from "./components/SessionListScreen.js";
import NewUserScreen from "./components/NewUserScreen.js";
import NewSessionScreen from "./components/NewSessionScreen";
const data = require("./data.json");

LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage", // While we're at it, squelch AyncStorage, too!
]);

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
const storage = getStorage(firebaseApp, "cs317-tutortrac.appspot.com"); // for storing images in Firebase storage

function HomeScreen(props) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "coral" },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Sessions") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      initialRouteName="Sessions"
    >
      <Tab.Screen name="Sessions" component={SessionListScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        navigation={props.navigation}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App(props) {
  /***************************************************************************
    INITIALIZATION
   ***************************************************************************/

  // Shared state for authentication
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  // Shared state for firestore data
  const [users, setUsers] = React.useState({});
  const [sessions, setSessions] = React.useState({});
  const [courses, setCourses] = React.useState({});

  // State for users & profile
  const [selectedUser, setSelectedUser] = React.useState(
    loggedInUser
      ? data.users.filter((user) => user.email === email)[0]
      : data.users[0]
  ); //for testing

  const [selectedSession, setSelectedSession] = React.useState(null);
  const resetSelectedSession = () =>
    setSelectedSession([
      "0",
      {
        recurringDay: "",
        tutor: selectedUser.UID,
        recurring: true,
        attendedUID: [],
        courses: [],
        location: "",
        startTime: new Date(Date.now()).toString(),
        SID: data.sessions.length,
        department: "",
        endTime: new Date(Date.now())
          .setHours(Date.now.getHours() + 1)
          .toString(),
        type: "",
        maxCapacity: 0,
      },
    ]);

  const firebaseProps = { auth, db, storage };
  const profileProps = { selectedUser, setSelectedUser, logOut };
  const sessionsProps = { selectedUser, setSelectedUser };
  const selectedProps = {
    selectedSession,
    setSelectedSession,
    resetSelectedSession,
  };

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

  const screenProps = {
    signedInProps,
    profileProps,
    sessionsProps,
    selectedProps,
    firebaseProps,
    firestoreProps,
  };

  /***************************************************************************
    APP LEVEL FUNCTIONALITIES
   ***************************************************************************/

  async function firebaseGetCourses() {
    const q = query(collection(db, "courses"));
    const querySnapshot = await getDocs(q);
    let FScourses = {};
    querySnapshot.forEach((doc) => {
      FScourses[doc.id] = doc.data();
    });
    setCourses(FScourses);
    console.log(`Firebase got courses: '${formatJSON(courses)}')`);
  }

  async function firebaseGetUsers() {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    let FSusers = {};
    querySnapshot.forEach((doc) => {
      FSusers[doc.id] = doc.data();
    });
    setUsers(FSusers);
    console.log(`Firebase got users: '${formatJSON(users)}')`);
  }

  async function firebaseGetSessions() {
    const q = query(collection(db, "sessions"));
    const querySnapshot = await getDocs(q);
    let FSsessions = {};
    querySnapshot.forEach((doc) => {
      FSsessions[doc.id] = doc.data();
    });
    setSessions(FSsessions);
    console.log(`Firebase got sessions: '${formatJSON(sessions)}')`);
  }

  function logOut() {
    console.log("logOut");
    console.log(
      `logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`
    );
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    console.log("logOut: signOut(auth)");
    signOut(auth); // Will eventually set auth.currentUser to null
  }

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
   On Mount & Unmount
   ***************************************************************************/
  useEffect(() => {
    console.log("App did mount");
    firebaseGetCourses();
    firebaseGetUsers();
    firebaseGetSessions();

    return () => {
      // Anything in here is fired on component unmount.
      console.log("App did unmount");
    };
  }, []);

  /***************************************************************************
    TOP LEVEL RENDERING
   ***************************************************************************/

  return (
    <StateContext.Provider value={screenProps}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Log In"
            screenOptions={{
              headerStyle: { backgroundColor: "#f1c40f" },
              headerShown: false,
            }}
          >
            <Stack.Screen name="Log In" component={SignInScreen} />
            <Stack.Screen name="Setup" component={NewUserScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Modify Session" component={NewSessionScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StateContext.Provider>
  );
}
