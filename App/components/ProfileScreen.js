import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import {
  Headline,
  Paragraph,
  BottomNavigation,
  Avatar,
  Appbar,
  IconButton,
} from "react-native-paper";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import SimplifiedSessionCard from "./SimplifiedSessionCard.js";
import { firebaseGetSpecifiedUser, firebaseGetCourses } from "./Firestore";
import { formatJSON, emailOf, logVal } from "../utils";
// const data = require("../data.json");

export default function ProfileScreen(props) {
  const screenProps = useContext(StateContext);
  const profileProps = screenProps.profileProps;
  const firebaseProps = screenProps.firebaseProps;
  const db = firebaseProps.db;
  const selectedProps = screenProps.selectedProps;
  const Refresher = screenProps.firestoreProps.refresher;

  const courses = screenProps.firestoreProps.courses;
  const setCourses = screenProps.firestoreProps.setCourses;
  const users = screenProps.firestoreProps.users;
  const setUsers = screenProps.firestoreProps.setUsers;
  const sessions = screenProps.firestoreProps.sessions;
  const setSessions = screenProps.firestoreProps.setSessions;

  const [hostedSessions, setHosted] = React.useState([]);
  const [tutoredCourses, setTutored] = React.useState([]);

  //on mount and unmount
  useEffect(() => {
    console.log("ProfileScreen did mount");
    return () => {
      // Anything in here is fired on component unmount.
      console.log("ProfileScreen did unmount");
    };
  }, []);

  //mount + when sessions changed...
  useEffect(() => {
    console.log("filter hosted sessions");
    filterHostedSessions();
    filterTutoredCourses();
  }, [sessions]);

  /***************************************************************************
   USERS FUNCTIONALITY CODE
   ***************************************************************************/
  //   async function firebaseGetAttendedSessions(UID) {
  //     const q = query(
  //       collection(db, "sessions"),
  //       where("attendedUID", "array-contains-any", [UID])
  //     );
  //     const querySnapshot = await getDocs(q);
  //     let attendedS = [];
  //     // unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       attendedS.push(doc.data());
  //     });
  //     // });
  //     setAttendedSessions(attendedS);
  //     // console.log(`on firebaseget: attendedSession('${formatJSON(attendedS)}')`);
  //   }

  function signOutAndGoToSignIn() {
    profileProps.logOut();
    props.navigation.navigate("Log In");
  }

  function filterHostedSessions() {
    let hosted = Object.entries(sessions).filter(
      ([key, session]) => session.tutor === profileProps.selectedUser.UID
    );
    setHosted(hosted);
  }

  function filterTutoredCourses() {
    let hosted = Object.entries(sessions).filter(
      ([key, session]) => session.tutor === profileProps.selectedUser.UID
    );
    let tutored = [];
    logVal("hosted", hosted).forEach(([key, session]) => {
      session.courses.forEach(
        (c) => (tutored.includes(c) ? null : tutored.push(c)) //make sure no duplicates in tutored courses
      );
    });
    setTutored(logVal("tutored", tutored));
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
              department={courses[id].department}
              number={courses[id].number}
            ></CourseItem>
          ))}
        </View>
        <Button
          title="Edit Profile"
          onPress={() => props.navigation.navigate("Setup")}
        />

        <Headline>Attended Sessions</Headline>
        <View style={globalStyles.courseContainer}>
          {Object.entries(sessions)
            .filter(([key, session]) =>
              session.attendedUID.includes(profileProps.selectedUser.UID)
            )
            .map(([key, session]) => {
              let index = parseInt(key);
              return (
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
              );
            })}
        </View>

        <Headline
          style={
            hostedSessions.length > 0
              ? globalStyles.visible
              : globalStyles.hidden
          }
        >
          Courses Tutoring For
        </Headline>
        <View style={globalStyles.courseContainer}>
          {tutoredCourses.map((id) => (
            <CourseItem
              key={id}
              department={courses[id].department}
              number={courses[id].number}
            ></CourseItem>
          ))}
        </View>

        <Headline
          style={
            hostedSessions.length > 0
              ? globalStyles.visible
              : globalStyles.hidden
          }
        >
          Hosted Sessions
        </Headline>
        <View style={globalStyles.courseContainer}>
          {hostedSessions.map(([key, session]) => {
            let index = parseInt(key);
            return (
              <SimplifiedSessionCard
                key={index}
                subtitle={users[session.tutor].name}
                title={
                  session.type +
                  ": " +
                  (session.courses.length > 0
                    ? courses[session.courses[0]].department +
                      " " +
                      (session.type == "Cafe"
                        ? ""
                        : courses[session.courses[0]].number)
                    : "")
                }
                action={() => {
                  selectedProps.setSelectedSession([key, session]);
                  //console.log(screenProps.selectedProps.selectedSession);
                  props.navigation.navigate("Add/Modify Session");
                }}
                content={session.startTime}
              ></SimplifiedSessionCard>
            );
          })}
        </View>

        <IconButton
          icon="plus-circle-outline"
          color={"#3498db"}
          size={40}
          style={styles.iconButton}
          onPress={() => props.navigation.navigate("Add/Modify Session")}
        />

        <Button title="Sign Out" onPress={signOutAndGoToSignIn} />
      </ScrollView>
      <Refresher></Refresher>
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
  iconButton: {
    alignSelf: "center",
  },
});
