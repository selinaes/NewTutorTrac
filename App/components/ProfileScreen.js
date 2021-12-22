import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import {
  Headline,
  Paragraph,
  BottomNavigation,
  Avatar,
  Appbar,
} from "react-native-paper";
import {
  // access to Firestore storage features:
  getFirestore,
  // for storage access
  collection,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import SimplifiedSessionCard from "./SimplifiedSessionCard.js";
import { firebaseGetSpecifiedUser, firebaseGetCourses } from "./Firestore";
import { formatJSON, emailOf } from "../utils";
const data = require("../data.json");

function docToObject(Doc) {
  console.log("docToObject");
  const data = Doc.data();
  // console.log(Doc.id, " => ", data);
  return { ...data };
}

export default function ProfileScreen(props) {
  const screenProps = useContext(StateContext);
  const profileProps = screenProps.profileProps;
  const firebaseProps = screenProps.firebaseProps;
  const db = firebaseProps.db;
  const selectedUser = screenProps.profileProps.selectedUser;
  const courses = screenProps.firestoreProps.courses;
  const setCourses = screenProps.firestoreProps.setCourses;
  const users = screenProps.firestoreProps.users;
  const setUsers = screenProps.firestoreProps.setUsers;

  const [attendedSessions, setAttendedSessions] = React.useState([]);

  //on mount and unmount
  useEffect(() => {
    console.log("ProfileScreen did mount");
    firebaseGetCourses();
    console.log(`on mount: courses('${formatJSON(courses)}')`);
    firebaseGetAttendedSessions(selectedUser.UID); // find user on mount
    console.log(
      `on mount: firebaseGetAttendedSessions('${selectedUser.name}')`
    );
    firebaseGetUsers();
    console.log(`on mount: firebaseGetUsers('${users}')`);
    return () => {
      // Anything in here is fired on component unmount.
      console.log("ProfileScreen did unmount");
    };
  }, []);

  useEffect(() => {
    firebaseGetAttendedSessions(selectedUser.UID); // find user on mount
    console.log(`course change happened:courses('${formatJSON(courses)}')`);
  }, [courses]);

  /***************************************************************************
   USERS FUNCTIONALITY CODE
   ***************************************************************************/
  async function firebaseGetAttendedSessions(UID) {
    const q = query(
      collection(db, "sessions"),
      where("attendedUID", "array-contains-any", [UID])
    );
    const querySnapshot = await getDocs(q);
    let attendedS = [];
    // unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      attendedS.push(doc.data());
    });
    // });
    setAttendedSessions(attendedS);
    // console.log(`on firebaseget: attendedSession('${formatJSON(attendedS)}')`);
  }

  async function firebaseGetCourses() {
    const q = query(collection(db, "courses"));
    const querySnapshot = await getDocs(q);
    let courses = [];
    // unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      courses.push(doc.data());
    });
    // });
    // console.log(`on firebasegetCourses: courses('${formatJSON(courses)}')`);
    setCourses(courses);
  }

  async function firebaseGetUsers() {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    let users = [];
    // unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    // });
    // console.log(`on firebasegetCourses: courses('${formatJSON(courses)}')`);
    setUsers(users);
  }

  function signOutAndGoToSignIn() {
    profileProps.logOut();
    props.navigation.navigate("Log In");
  }

  /***************************************************************************
     RENDERING PROFILE TAB
    ***************************************************************************/

  function displayPersonalInfo() {
    return (
      <View>
        <Paragraph>Name: {profileProps.selectedUser.name}</Paragraph>
        <Paragraph>Email: {profileProps.selectedUser.email}</Paragraph>
        <Paragraph>
          Class Year: Class of {profileProps.selectedUser.classyear}
        </Paragraph>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <ScrollView style={globalStyles.scrollView}>
        <Avatar.Text
          size={150}
          label={profileProps.selectedUser.email.slice(0, 2).toUpperCase()}
        />
        {displayPersonalInfo()}
        <Headline>Registered Courses</Headline>
        <View style={globalStyles.courseContainer}>
          {profileProps.selectedUser.courses.map((id) => (
            <CourseItem
              key={id}
              department={data.courses[id].department}
              number={data.courses[id].number}
            ></CourseItem>
          ))}
        </View>

        <Headline>Attended Sessions</Headline>
        <View style={globalStyles.courseContainer}>
          {attendedSessions.map((session, index) => (
            <SimplifiedSessionCard
              key={index}
              subtitle={users[session.tutor].name}
              title={
                session.type +
                ": " +
                (session.courses.length > 0
                  ? courses[session.courses[0]].department +
                    " " +
                    (session.type === "Cafe"
                      ? ""
                      : courses[session.courses[0]].number)
                  : "")
              }
              content={session.startTime}
            ></SimplifiedSessionCard>
          ))}
        </View>

        <Headline>Hosted Sessions</Headline>
        <View style={globalStyles.courseContainer}>
          {data.sessions
            .filter(
              (session) => session.tutor === profileProps.selectedUser.UID
            )
            .map((session, index) => (
              <SimplifiedSessionCard
                key={index}
                subtitle={data.users[session.tutor - 1].name}
                title={
                  session.type +
                  ": " +
                  (session.courses.length > 0
                    ? data.courses[session.courses[0]].department +
                      " " +
                      (session.type == "Cafe"
                        ? ""
                        : data.courses[session.courses[0]].number)
                    : "")
                }
                content={session.startTime}
              ></SimplifiedSessionCard>
            ))}
        </View>
        <Button title="Sign Out" onPress={signOutAndGoToSignIn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
});
