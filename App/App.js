import React, { useState, useEffect } from "react";
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, TextInput, 
         TouchableOpacity, View } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Provider as PaperProvider } from 'react-native-paper';
import { initializeApp } from "firebase/app";
import { // access to authentication features:
         getAuth, 
         // for email/password authentication: 
         createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
         // for logging out:
         signOut
  } from "firebase/auth";

/* 
// *** REPLACE THIS STUB! ***
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "...details omitted...",
  authDomain: "...details omitted...",
  projectId: "...details omitted...",
  storageBucket: "...details omitted...",
  messagingSenderId: "...details omitted...",
  appId: "...details omitted...",
};
*/

const firebaseConfig = {
  apiKey: "AIzaSyCtvvMpb2icR7di4hyGnD7Wg76hussiBYk",
  authDomain: "cs317-tutortrac.firebaseapp.com",
  projectId: "cs317-tutortrac",
  storageBucket: "cs317-tutortrac.appspot.com",
  messagingSenderId: "883004559565",
  appId: "1:883004559565:web:765c9894d3dbcfc0b19984",
  measurementId: "G-ZK9YEKDBDT"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necesseary if use this CSS:
  //   white-space: break-spaces; (or pre-wrap)
  // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
  return JSON.stringify(jsonVal, null, 2);
}

function emailOf(user) {
  if (user) {
    return user.email;
  } else {
    return null;
  }
}

const fakeUsers = [
	{
		"UID": 1,
		"name": "Quemby Burke",
		"classyear": 2024,
		"list": "ECON 226, PSYC101, ENG 224, THST 345",
		"attendedSID": "9, 8"
	},
	{
		"UID": 2,
		"name": "Jasmine Talley",
		"classyear": 2024,
		"list": "CS 232, GER 234, CS 317, REL 260",
		"attendedSID": "11, 16"
	},
	{
		"UID": 3,
		"name": "Stuart Martinez",
		"classyear": 2024,
		"list": "BISC 113, ENG 224, PHYS 106, ARTS 207",
		"attendedSID": "18, 9, 13"
	},
	{
		"UID": 4,
		"name": "Ginger Sheppard",
		"classyear": 2024,
		"list": "CS 232, ARTS 207, CHEM 341, CHEM 205",
		"attendedSID": 9
	},
	{
		"UID": 5,
		"name": "Regina Rocha",
		"classyear": 2022,
		"list": "ANTH 319, EDUC 216, CS 230, CHEM 341",
		"attendedSID": 9
	},
	{
		"UID": 6,
		"name": "Chandler Santos",
		"classyear": 2024,
		"list": "BIOC 220, POL2 204, CAMS 135, CS 230",
		"attendedSID": "10, 12, 3, 17"
	},
	{
		"UID": 7,
		"name": "Galvin Clay",
		"classyear": 2024,
		"list": "CHEM 341, PHYS 106, ENG 301, AMST 232",
		"attendedSID": "14, 3, 11, 13, 9"
	},
	{
		"UID": 8,
		"name": "Hedy Langley",
		"classyear": 2023,
		"list": "PEAC 240, CHEM 341, CS 111, BIOC 220",
		"attendedSID": "11, 18, 2, 1"
	},
	{
		"UID": 9,
		"name": "Timothy George",
		"classyear": 2024,
		"list": "CHEM 341, AFR 239, ECON 226, GER 234",
		"attendedSID": 12
	},
	{
		"UID": 10,
		"name": "Justin Frost",
		"classyear": 2024,
		"list": "PSYC101, CS 230, WRIT 170, BIOC 220",
		"attendedSID": "14, 13, 17"
	},
	{
		"UID": 11,
		"name": "Yoko Livingston",
		"classyear": 2025,
		"list": "FREN 207, GER 234, PEAC 240, CHEM 341",
		"attendedSID": "9, 14, 8"
	},
	{
		"UID": 12,
		"name": "Patience Park",
		"classyear": 2023,
		"list": "ENG 301, PEAC 240, MUS 202, CAMS 135",
		"attendedSID": "1, 12"
	},
	{
		"UID": 13,
		"name": "Sean Rose",
		"classyear": 2023,
		"list": "REL 260, ARTS 207, ECON 226, PSYC101",
		"attendedSID": "15, 20, 12"
	},
	{
		"UID": 14,
		"name": "Gillian Cote",
		"classyear": 2024,
		"list": "LING 246, ANTH 319, ANTH 210, CHEM 212",
		"attendedSID": "9, 15, 16, 13"
	},
	{
		"UID": 15,
		"name": "Timon Chavez",
		"classyear": 2023,
		"list": "AMST 232, LING 246, AFR 211, CHEM 341",
		"attendedSID": 18
	},
	{
		"UID": 16,
		"name": "Barrett Luna",
		"classyear": 2022,
		"list": "CS 111, BISC 113, ECON 102, JPN 290",
		"attendedSID": "15, 8"
	},
	{
		"UID": 17,
		"name": "Elliott Stephenson",
		"classyear": 2024,
		"list": "CHEM 205, CS 230, THST 345, ARTS 207",
		"attendedSID": "14, 11, 2, 6"
	},
	{
		"UID": 18,
		"name": "Price Roach",
		"classyear": 2023,
		"list": "CS 232, PHYS 106, ANTH 210, LING 246",
		"attendedSID": "11, 16"
	},
	{
		"UID": 19,
		"name": "Georgia Coffey",
		"classyear": 2024,
		"list": "BIOC 220, CS 232, LING 246, JPN 290",
		"attendedSID": "3, 20, 13, 7, 9"
	},
	{
		"UID": 20,
		"name": "Yen Dickerson",
		"classyear": 2022,
		"list": "PHYS 106, ENG 224, AFR 211, ANTH 319",
		"attendedSID": "18, 17, 4, 2, 5"
	},
	{
		"UID": 21,
		"name": "Duncan Simon",
		"classyear": 2023,
		"currentCourses": "SPAN202, EDUC 216, ARTS 207, THST 345",
		"attendedSID": 13,
		"hostedSID": "9, 5"
	},
	{
		"UID": 22,
		"name": "Josiah Stewart",
		"classyear": 2023,
		"currentCourses": "ANTH 210, CS 111, THST 345, CHEM 205",
		"attendedSID": "13, 11, 14",
		"hostedSID": 17
	},
	{
		"UID": 23,
		"name": "Martin Levine",
		"classyear": 2022,
		"currentCourses": "ECON 226, ANTH 319, CS 111, WRIT 170",
		"attendedSID": "18, 17, 16",
		"hostedSID": "7, 17"
	},
	{
		"UID": 24,
		"name": "Kirsten Bonner",
		"classyear": 2022,
		"currentCourses": "FREN 207, AFR 239, PEAC 240, CS 230",
		"attendedSID": "7, 9, 3",
		"hostedSID": "11, 13"
	},
	{
		"UID": 25,
		"name": "Bo Meyers",
		"classyear": 2024,
		"currentCourses": "BISC 113, CS 111, THST 345, BISC 110",
		"attendedSID": 13,
		"hostedSID": 5
	}
]

const fakeSessions = [
	{
		"SID": 1,
		"department": "EDUC",
		"courses": "ECON 102",
		"type": "OH",
		"location": "SCI-L045",
		"tutor": "Briar Knapp",
		"startTime": "Sep 14, 2021 2:44 AM",
		"endTime": "Dec 6, 2021 7:02 PM",
		"recurring": "Yes",
		"recurringDay": "",
		"maxcapacity": 7,
		"attendedUID": "79, 97, 7, 11, 23, 5"
	},
	{
		"SID": 2,
		"department": "PHYS",
		"courses": "REL 260",
		"type": "Cafe",
		"location": "SCI-L045",
		"tutor": "Allistair Farley",
		"startTime": "Sep 11, 2021 8:41 AM",
		"endTime": "Dec 6, 2021 11:37 PM",
		"recurring": "Yes",
		"recurringDay": "Mon",
		"maxcapacity": 20,
		"attendedUID": "13, 43, 1, 3, 97, 23, 47"
	},
	{
		"SID": 3,
		"department": "WRIT",
		"courses": "",
		"type": "Cafe",
		"location": "FND-102",
		"tutor": "Rhea Patrick",
		"startTime": "Sep 9, 2021 1:57 PM",
		"endTime": "Dec 6, 2021 8:14 PM",
		"recurring": "No",
		"recurringDay": "Thr",
		"maxcapacity": 9,
		"attendedUID": "19, 89, 37, 7, 47"
	},
	{
		"SID": 4,
		"department": "LING",
		"courses": "JPN 290",
		"type": "Cafe",
		"location": "LIB-268",
		"tutor": "Priscilla Juarez",
		"startTime": "Sep 11, 2021 10:42 AM",
		"endTime": "Dec 6, 2021 9:38 PM",
		"recurring": "Yes",
		"recurringDay": "Mon, Thr",
		"maxcapacity": 19,
		"attendedUID": "5, 73, 37, 89, 1, 61, 83, 19, 41"
	},
	{
		"SID": 5,
		"department": "LING",
		"courses": "SPAN202, POL2 204",
		"type": "SI",
		"location": "PNE-349",
		"tutor": "Trevor Robles",
		"startTime": "Sep 12, 2021 4:54 PM",
		"endTime": "Dec 6, 2021 2:43 PM",
		"recurring": "Yes",
		"recurringDay": "Fri",
		"maxcapacity": 20,
		"attendedUID": "79, 37, 61"
	},
	{
		"SID": 6,
		"department": "WRIT",
		"courses": "ECON 226",
		"type": "SI",
		"location": "SCI-L043",
		"tutor": "Melinda Knowles",
		"startTime": "Sep 13, 2021 7:40 PM",
		"endTime": "Dec 6, 2021 10:53 PM",
		"recurring": "No",
		"recurringDay": "Fri, Mon",
		"maxcapacity": 7,
		"attendedUID": "11, 53, 2, 19, 47, 83, 23, 5"
	},
	{
		"SID": 7,
		"department": "WRIT",
		"courses": "AFR 239, CS 317",
		"type": "Cafe",
		"location": "https://wellesley.zoom.us/j/94924397399",
		"tutor": "Reece Joyner",
		"startTime": "Sep 14, 2021 6:45 AM",
		"endTime": "Dec 6, 2021 1:09 PM",
		"recurring": "Yes",
		"recurringDay": "",
		"maxcapacity": 12,
		"attendedUID": "31, 59, 53, 61"
	},
	{
		"SID": 8,
		"department": "WRIT",
		"courses": "CHEM 212",
		"type": "Cafe",
		"location": "LIB-268",
		"tutor": "Gil Black",
		"startTime": "Sep 12, 2021 10:11 AM",
		"endTime": "Dec 6, 2021 8:27 PM",
		"recurring": "No",
		"recurringDay": "Wed",
		"maxcapacity": 23,
		"attendedUID": "83, 89, 3, 67, 53, 37"
	},
	{
		"SID": 9,
		"department": "BISC",
		"courses": "BISC 113",
		"type": "OH",
		"location": "PNE-349",
		"tutor": "Erin Lawson",
		"startTime": "Sep 9, 2021 6:44 PM",
		"endTime": "Dec 6, 2021 9:16 PM",
		"recurring": "Yes",
		"recurringDay": "",
		"maxcapacity": 24,
		"attendedUID": "23, 61, 31, 89, 7"
	},
	{
		"SID": 10,
		"department": "ASTR",
		"courses": "ECON 226, SPAN202, GER 234",
		"type": "Cafe",
		"location": "PNE-349",
		"tutor": "Orla Patel",
		"startTime": "Sep 11, 2021 3:29 AM",
		"endTime": "Dec 6, 2021 11:08 PM",
		"recurring": "No",
		"recurringDay": "Fri, Tue",
		"maxcapacity": 12,
		"attendedUID": "2, 67, 31, 47, 13, 1, 73, 59, 41, 83"
	},
	{
		"SID": 11,
		"department": "EDUC",
		"courses": "AFR 211",
		"type": "SI",
		"location": "FND-102",
		"tutor": "Orlando Kemp",
		"startTime": "Sep 12, 2021 12:39 AM",
		"endTime": "Dec 6, 2021 1:41 PM",
		"recurring": "Yes",
		"recurringDay": "Mon, Fri",
		"maxcapacity": 30,
		"attendedUID": "43, 19, 5"
	},
	{
		"SID": 12,
		"department": "CS",
		"courses": "BIOC 220, BISC 110",
		"type": "SI",
		"location": "SCI-L045",
		"tutor": "Maryam Whitaker",
		"startTime": "Sep 9, 2021 3:34 AM",
		"endTime": "Dec 6, 2021 4:42 PM",
		"recurring": "Yes",
		"recurringDay": "Wed",
		"maxcapacity": 7,
		"attendedUID": "37, 1"
	},
	{
		"SID": 13,
		"department": "CS",
		"courses": "",
		"type": "OH",
		"location": "SCI-L043",
		"tutor": "Geraldine Britt",
		"startTime": "Sep 11, 2021 9:54 AM",
		"endTime": "Dec 6, 2021 9:57 PM",
		"recurring": "Yes",
		"recurringDay": "Mon",
		"maxcapacity": 20,
		"attendedUID": "17, 1, 73"
	},
	{
		"SID": 14,
		"department": "ANTH",
		"courses": "ECON 226",
		"type": "OH",
		"location": "SCI-L045",
		"tutor": "Ryan Kidd",
		"startTime": "Sep 10, 2021 7:55 AM",
		"endTime": "Dec 6, 2021 1:00 PM",
		"recurring": "No",
		"recurringDay": "Mon, Wed",
		"maxcapacity": 14,
		"attendedUID": "47, 67, 2, 11, 13, 31, 29"
	},
	{
		"SID": 15,
		"department": "BIOC",
		"courses": "ECON 226",
		"type": "OH",
		"location": "FND-102",
		"tutor": "Kareem Vance",
		"startTime": "Sep 12, 2021 12:54 AM",
		"endTime": "Dec 6, 2021 12:40 PM",
		"recurring": "Yes",
		"recurringDay": "",
		"maxcapacity": 7,
		"attendedUID": "61, 43, 19, 2, 73, 7, 1, 89, 83"
	},
	{
		"SID": 16,
		"department": "AMST",
		"courses": "BISC 110, CS 111, SPAN202",
		"type": "Cafe",
		"location": "SCI-L043",
		"tutor": "Ann Kinney",
		"startTime": "Sep 10, 2021 10:11 AM",
		"endTime": "Dec 6, 2021 6:31 PM",
		"recurring": "No",
		"recurringDay": "Fri, Thr",
		"maxcapacity": 9,
		"attendedUID": "61, 71, 89, 53, 23, 31"
	},
	{
		"SID": 17,
		"department": "EDUC",
		"courses": "PEAC 240",
		"type": "Cafe",
		"location": "SCI-L045",
		"tutor": "Rina Salazar",
		"startTime": "Sep 14, 2021 5:54 AM",
		"endTime": "Dec 6, 2021 8:43 PM",
		"recurring": "Yes",
		"recurringDay": "",
		"maxcapacity": 9,
		"attendedUID": "7, 3"
	},
	{
		"SID": 18,
		"department": "EDUC",
		"courses": "",
		"type": "OH",
		"location": "LIB-268",
		"tutor": "Eagan King",
		"startTime": "Sep 11, 2021 6:05 PM",
		"endTime": "Dec 6, 2021 7:19 PM",
		"recurring": "No",
		"recurringDay": "Tue",
		"maxcapacity": 22,
		"attendedUID": "13, 11, 7, 2, 67, 83, 43, 53, 73"
	},
	{
		"SID": 19,
		"department": "AMST",
		"courses": "AMST 232, CHEM 341",
		"type": "OH",
		"location": "SCI-L045",
		"tutor": "Isaiah Ferrell",
		"startTime": "Sep 10, 2021 9:15 PM",
		"endTime": "Dec 6, 2021 9:18 PM",
		"recurring": "No",
		"recurringDay": "",
		"maxcapacity": 6,
		"attendedUID": "47, 19, 7, 17, 11"
	},
	{
		"SID": 20,
		"department": "CAMS",
		"courses": "WRIT 170, MUS 202, CHEM 341",
		"type": "OH",
		"location": "PNE-349",
		"tutor": "Jaime Weber",
		"startTime": "Sep 11, 2021 6:30 PM",
		"endTime": "Dec 6, 2021 2:56 PM",
		"recurring": "Yes",
		"recurringDay": "Wed",
		"maxcapacity": 25,
		"attendedUID": "29, 31, 1, 47, 61, 67, 17, 7"
	},
	{
		"SID": 21,
		"department": "AFR",
		"courses": "AMST 232",
		"type": "Cafe",
		"location": "FND-102",
		"tutor": "Sean Whitfield",
		"startTime": "Sep 9, 2021 3:02 PM",
		"endTime": "Dec 6, 2021 12:54 PM",
		"recurring": "Yes",
		"recurringDay": "",
		"maxcapacity": 14,
		"attendedUID": "31, 43, 73"
	},
	{
		"SID": 22,
		"department": "LING",
		"courses": "CHEM 205, AMST 232",
		"type": "SI",
		"location": "FND-102",
		"tutor": "Isabelle Murphy",
		"startTime": "Sep 13, 2021 10:24 AM",
		"endTime": "Dec 6, 2021 8:47 AM",
		"recurring": "Yes",
		"recurringDay": "Mon",
		"maxcapacity": 11,
		"attendedUID": "67, 53, 79, 43, 17, 23"
	},
	{
		"SID": 23,
		"department": "CHEM",
		"courses": "MUS 202, BISC 113",
		"type": "OH",
		"location": "SCI-L043",
		"tutor": "Mari Villarreal",
		"startTime": "Sep 11, 2021 9:57 AM",
		"endTime": "Dec 6, 2021 8:46 PM",
		"recurring": "Yes",
		"recurringDay": "",
		"maxcapacity": 29,
		"attendedUID": "71, 59, 5"
	},
	{
		"SID": 24,
		"department": "ARTS",
		"courses": "WRIT 170, CHEM 212",
		"type": "Cafe",
		"location": "FND-102",
		"tutor": "Edward Carney",
		"startTime": "Sep 13, 2021 1:24 PM",
		"endTime": "Dec 6, 2021 5:03 PM",
		"recurring": "No",
		"recurringDay": "Mon",
		"maxcapacity": 8,
		"attendedUID": "73, 47"
	},
	{
		"SID": 25,
		"department": "BIOC",
		"courses": "WRIT 170, THST 345",
		"type": "SI",
		"location": "https://wellesley.zoom.us/j/94924397399",
		"tutor": "Colt Spence",
		"startTime": "Sep 9, 2021 1:45 AM",
		"endTime": "Dec 6, 2021 2:41 PM",
		"recurring": "Yes",
		"recurringDay": "Fri, Tue",
		"maxcapacity": 27,
		"attendedUID": "1, 3, 83, 23"
	},
	{
		"SID": 26,
		"department": "BIOC",
		"courses": "ENG 224",
		"type": "OH",
		"location": "FND-102",
		"tutor": "Signe Clemons",
		"startTime": "Sep 10, 2021 3:25 AM",
		"endTime": "Dec 6, 2021 8:28 AM",
		"recurring": "No",
		"recurringDay": "Wed",
		"maxcapacity": 16,
		"attendedUID": "5, 43, 59, 1, 53, 3, 2, 61, 41"
	},
	{
		"SID": 27,
		"department": "AMST",
		"courses": "POL2 204",
		"type": "OH",
		"location": "SCI-L043",
		"tutor": "Tatum Castillo",
		"startTime": "Sep 12, 2021 8:26 AM",
		"endTime": "Dec 6, 2021 10:45 PM",
		"recurring": "Yes",
		"recurringDay": "Fri, Mon",
		"maxcapacity": 14,
		"attendedUID": "97, 47, 31, 79, 83, 17"
	},
	{
		"SID": 28,
		"department": "CHEM",
		"courses": "AMST 232, PEAC 240, ECON 226",
		"type": "Cafe",
		"location": "https://wellesley.zoom.us/j/94924397399",
		"tutor": "Kiona Langley",
		"startTime": "Sep 13, 2021 10:58 PM",
		"endTime": "Dec 6, 2021 7:37 AM",
		"recurring": "No",
		"recurringDay": "",
		"maxcapacity": 23,
		"attendedUID": "17, 43, 31, 73, 37"
	},
	{
		"SID": 29,
		"department": "PHYS",
		"courses": "CS 230, JPN 290, ARTS 207",
		"type": "OH",
		"location": "SCI-L045",
		"tutor": "Talon Harrison",
		"startTime": "Sep 13, 2021 7:03 PM",
		"endTime": "Dec 6, 2021 11:31 AM",
		"recurring": "No",
		"recurringDay": "",
		"maxcapacity": 26,
		"attendedUID": "23, 43, 97"
	},
	{
		"SID": 30,
		"department": "ANTH",
		"courses": "BIOC 220, GER 234, BISC 113",
		"type": "OH",
		"location": "FND-102",
		"tutor": "Maggy Leach",
		"startTime": "Sep 8, 2021 10:10 PM",
		"endTime": "Dec 6, 2021 12:43 PM",
		"recurring": "No",
		"recurringDay": "Thr",
		"maxcapacity": 10,
		"attendedUID": "23, 97, 73, 79, 7"
	}
]


export default function App() {


  /***************************************************************************
   INITIALIZATION
   ***************************************************************************/

  // State for authentication 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [loggedInUser, setLoggedInUser] = React.useState(null);

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



  // component mount and unmount
  useEffect(() => {
      // Anything in here is fired on component mount.
      console.log('Component did mount');
      console.log(`on mount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
      console.log(`on mount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
      checkEmailVerification();
      return () => {
        // Anything in here is fired on component unmount.
        console.log('Component did unmount');
        console.log(`on unmount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
        console.log(`on unmount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
      }
    }, [])



/***************************************************************************
   AUTHENTICATION CODE

   ***************************************************************************/
  // Clear error message when email is updated to be nonempty
  useEffect(
    () => { if (email != '') setErrorMsg(''); },
    [email]
  ); 

  function signUpUserEmailPassword() {
    console.log('called signUpUserEmailPassword');
    if (auth.currentUser) {
      signOut(auth); // sign out auth's current user (who is not loggedInUser, 
                     // or else we wouldn't be here
    }
    if (!email.includes('@')) {
      setErrorMsg('Not a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password too short');
      return;
    }
    // Invoke Firebase authentication API for Email/Password sign up 
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(`signUpUserEmailPassword: sign up for email ${email} succeeded (but email still needs verification).`);

        // Clear email/password inputs
        const savedEmail = email; // Save for email verification
        setEmail('');
        setPassword('');

        // Note: could store userCredential here if wanted it later ...
        // console.log(`createUserWithEmailAndPassword: setCredential`);
        // setCredential(userCredential);

        // Send verication email
        console.log('signUpUserEmailPassword: about to send verification email');
        sendEmailVerification(auth.currentUser)
        .then(() => {
            console.log('signUpUserEmailPassword: sent verification email');
            setErrorMsg(`A verification email has been sent to ${savedEmail}. You will not be able to sign in to this account until you click on the verification link in that email.`); 
            // Email verification sent!
            // ...
          });
      })
      .catch((error) => {
        console.log(`signUpUserEmailPassword: sign up failed for email ${email}`);
        const errorMessage = error.message;
        // const errorCode = error.code; // Could use this, too.
        console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
        setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
      });
  }

  function signInUserEmailPassword() {
    console.log('called signInUserEmailPassword');
    console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(auth.currentUser)}`); 
    console.log(`signInUserEmailPassword: emailOf(loggedInUser)0=${emailOf(loggedInUser)}`); 
    // Invoke Firebase authentication API for Email/Password sign in 
    // Use Email/Password for authentication 
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(`signInUserEmailPassword succeeded for email ${email}; have userCredential for emailOf(auth.currentUser)=${emailOf(auth.currentUser)} (but may not be verified)`); 
        console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(auth.currentUser)}`); 
        console.log(`signInUserEmailPassword: emailOf(loggedInUser)1=${emailOf(loggedInUser)}`); 

        // Only log in auth.currentUser if their email is verified
        checkEmailVerification();

        // Clear email/password inputs 
        setEmail('');
        setPassword('');

        // Note: could store userCredential here if wanted it later ...
        // console.log(`createUserWithEmailAndPassword: setCredential`);
        // setCredential(userCredential);
    
        })
      .catch((error) => {
        console.log(`signUpUserEmailPassword: sign in failed for email ${email}`);
        const errorMessage = error.message;
        // const errorCode = error.code; // Could use this, too.
        console.log(`signInUserEmailPassword: ${errorMessage}`);
        setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
      });
  }

  function checkEmailVerification() {
    if (auth.currentUser) {
      console.log(`checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`);
      if (auth.currentUser.emailVerified) {
        console.log(`checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`);
        setLoggedInUser(auth.currentUser);
        console.log("checkEmailVerification: setErrorMsg('')")
        setErrorMsg('')
      } else {
        console.log('checkEmailVerification: remind user to verify email');
        setErrorMsg(`You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
      }
    }
  }

  function logOut() {
    console.log('logOut'); 
    console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    console.log('logOut: signOut(auth)');
    signOut(auth); // Will eventually set auth.currentUser to null     
  }




/***************************************************************************
   SESSIONS FUNCTIONALITY CODE
   ***************************************************************************/











/***************************************************************************
   USERS FUNCTIONALITY CODE
   ***************************************************************************/


  









  /***************************************************************************
   RENDERING AUTHENTICATION
   ***************************************************************************/

   function loginPane() {
    return (
      <View style={loggedInUser === null ? styles.loginLogoutPane : styles.hidden}>
        <View style={styles.labeledInput}>
          <Text style={styles.inputLabel}>Email:</Text>
          <TextInput placeholder="Enter an email address" 
            style={styles.textInput} 
            value={email} 
            onChangeText={ textVal => setEmail(textVal)} />
        </View>
        <View style={styles.labeledInput}>
          <Text style={styles.inputLabel}>Password:</Text>
          <TextInput placeholder="Enter a password" 
            style={styles.textInput} 
            value={password} 
            onChangeText={ textVal => setPassword(textVal)} />
        </View>
        <View style={styles.buttonHolder}>
          <TouchableOpacity style={styles.button}
             onPress={() => signUpUserEmailPassword()}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={styles.button}
             onPress={() => signInUserEmailPassword()}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity> 
        </View>
        <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
          <Text style={styles.errorMessage}>{errorMsg}</Text>
        </View>
      </View>
    );
  }

/***************************************************************************
   RENDERING DEBUGGING INFO
   ***************************************************************************/
  
   function displayStates() {
    return (
      <ScrollView style={styles.jsonContainer}>
        <Text style={styles.json}>Selected User: {formatJSON(selectedUser)}</Text>
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
  //      <View style={[styles.screen, {backgroundColor: color}]}>
  //        <Picker
  //           style={styles.pickerStyles}
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
  //   <View style={[styles.screen]}>
  //     <Picker
  //        style={styles.pickerStyles}
  //        mode='dialog' // or 'dialog'; chooses mode on Android
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
        <View style={[styles.screen]}>
          <Text >Name: {selectedUser.name}</Text>
          <Text >Email: {selectedUser.email}</Text>
          <Text >Class Year: Class of {selectedUser.classyear}</Text>
        </View>
    );
  }






/***************************************************************************
   TOP LEVEL RENDERING 
   ***************************************************************************/

   return (
    <PaperProvider>
    <View style={styles.screen}>
      <StatusBar style="auto" />
      {loginPane()}
      {/* {colorSelect()} */}
      {displayPersonalInfo()}
      {displayStates()}
    </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  }, 
  loginLogoutPane: {
      flex: 3, 
      alignItems: 'center',
      justifyContent: 'center',
  }, 
  labeledInput: {
      width: "100%",
      alignItems: 'center',
      justifyContent: 'center',
  }, 
  inputLabel: {
      fontSize: 20,
  }, 
  textInput: {
      width: "80%",
      fontSize: 20,
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
      marginBottom: 8,
  },
  buttonHolder: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

  },
  button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'blue',
      margin: 5,
  },
  buttonText: {
      fontSize: 20,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
  },
  errorBox: {
      width: '80%',
      borderWidth: 1,
      borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
      borderColor: 'red',
  },
  errorMessage: {
      color: 'red',
      padding: 10, 
  },
  hidden: {
      display: 'none',
  },
  visible: {
      display: 'flex',
  },
  jsonContainer: {
      flex: 1,
      width: '98%',
      borderWidth: 1,
      borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
      borderColor: 'blue',
  },
  json: {
      padding: 10, 
      color: 'blue', 
  },
  pickerStyles:{
    width:'70%',
    backgroundColor:'gray',
    color:'black'
  }
});
