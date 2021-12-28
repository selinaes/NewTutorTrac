import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  SectionList,
  Array,
  ScrollView,
} from "react-native";
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  collection,
} from "firebase/firestore";
import { Avatar } from "react-native-paper";
const data = require("../data.json");
import StateContext from "./StateContext.js";
import DetailedSessionCard from "./DetailedSessionCard.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf, logVal } from "../utils";
import { globalStyles } from "../styles/globalStyles.js";

const testDate = true;

export default function DataDisplayScreen(props) {
  const screenProps = useContext(StateContext);
  const Refresher = screenProps.firestoreProps.refresher;
  const db = screenProps.firebaseProps.db;

  const selectedSession = screenProps.selectedProps.selectedSession;
  const setSelectedSession = screenProps.selectedProps.setSelectedSession;

  const courses = screenProps.firestoreProps.courses;
  const users = screenProps.firestoreProps.users;
  const setUsers = screenProps.firestoreProps.setUsers;
  const sessions = screenProps.firestoreProps.sessions;
  const setSessions = screenProps.firestoreProps.setSessions;

  const [attendees, setAttendees] = useState([]); //local state to take record of attending
  const [useAttending, setUseAttending] = useState(false);

  function calculateAttendees(attendList) {
    const attendsCourseLog = []; //logging attended user who are registered for a relevant class

    //a record for attendees, classify them based on which relevant course they belong, in the form: [{title:CS 317, data:xxx},{},...]
    let workingAttendees = [];
    workingAttendees = selectedSession[1].courses.map((course) => ({
      title: courses[course].department + " " + courses[course].number, //the course they belong to
      data: attendList.filter((user) => {
        const attendsCourse = users[user].courses.includes(course); //a boolean, whether the attendList person take this specific course or not
        if (attendsCourse) {
          attendsCourseLog.push(user);
        }
        return attendsCourse; //returns the boolean value for the filtering
      }),
    }));
    //For all other attended student, add to attendees
    workingAttendees.push({
      title: "OTHER",
      data: attendList.filter(
        (user) => !attendsCourseLog.includes(user) //people not in this class but attend anyway (due to fake data)
      ),
    });
    setAttendees(workingAttendees);
  }

  useEffect(() => {
    logVal("selectedSession", selectedSession);
    firebaseCheckAttendingAndAddField();
    return () => {
      // Anything in here is fired on component unmount.
      screenProps.selectedProps.setSelectedSession(null);
    };
  }, []);

  //everytime selectedSession changes, re-calculateAttendees
  useEffect(() => {
    calculateAttendees(
      logVal("useAttending", useAttending)
        ? selectedSession[1].attendingUID
        : selectedSession[1].attendedUID
    );
  }, [selectedSession]);

  async function firebaseCheckAttendingAndAddField() {
    const docRef = doc(db, "sessions", selectedSession[0]);
    const docSnap = await getDoc(docRef);
    let remoteSession = docSnap.data();
    if (remoteSession.hasOwnProperty("attendingUID")) {
      setSelectedSession([docSnap.id, remoteSession]); //make sure selectedSession is the most up to date
      setUseAttending(true);
    } else {
      await updateDoc(docRef, {
        attendingUID: remoteSession.attendedUID, //if no such field, create one and make it the current "attendedUID"
      });
      const newSession = {
        ...remoteSession,
        attendingUID: remoteSession.attendedUID,
      };
      setSelectedSession([docSnap.id, newSession]); //make sure selectedSession is the most up to date, with "attendingUID" field
      setUseAttending(true); //use existing attendedUID to calculate attendees
    }
  }

  const now = new Date(Date.now());
  const start = testDate ? now : new Date(selectedSession[1].startTime);
  const end = testDate ? now : new Date(selectedSession[1].endTime);

  async function firebaseCheckIn() {
    const docRef = doc(db, "sessions", selectedSession[0]);
    const docSnap = await getDoc(docRef);
    let attendingList = docSnap.data().attendingUID;
    let attendedList = docSnap.data().attendedUID;
    attendingList.push(screenProps.profileProps.selectedUser.UID);
    if (!attendedList.includes(screenProps.profileProps.selectedUser.UID)) {
      //make sure user not already in the attendedList---possible if they attended and then checked out
      attendedList.push(screenProps.profileProps.selectedUser.UID);
    }
    await updateDoc(docRef, {
      attendingUID: attendingList,
      attendedUID: attendedList, //update both attending & attended List in Checkin
    });
    const newSession = {
      ...docSnap.data(),
      attendingUID: attendingList,
      attendedUID: attendedList,
    };
    setSelectedSession([docSnap.id, newSession]);
  }

  async function firebaseCheckOut() {
    const docRef = doc(db, "sessions", selectedSession[0]);
    const docSnap = await getDoc(docRef);
    let tempList = docSnap.data().attendingUID;
    tempList.splice(
      tempList.indexOf(screenProps.profileProps.selectedUser.UID),
      1
    ); //splice(start, deleteCount)
    await updateDoc(docRef, {
      attendingUID: tempList, //only need to delete from "attending" when person checkout, not "attended"
    });
    const newSession = {
      ...docSnap.data(),
      attendingUID: tempList,
    };
    setSelectedSession([docSnap.id, newSession]);
  }

  function updateSelectedToSessions() {
    let SID = selectedSession[0];
    let temp = JSON.parse(JSON.stringify(sessions));
    temp[SID] = selectedSession[1];
    setSessions(temp);
  }

  return (
    <View style={globalStyles.screen}>
      <DetailedSessionCard
        subtitle={users[selectedSession[1].tutor].name}
        title={
          selectedSession[1].type +
          ": " +
          courses[selectedSession[1].courses[0]].department +
          " " +
          (selectedSession[1].type == "Cafe"
            ? ""
            : courses[selectedSession[1].courses[0]].number)
        }
        data={selectedSession[1]}
        content={
          <View style={globalStyles.courseContainer}>
            {selectedSession[1].courses.map((id) => (
              <CourseItem
                key={id}
                department={courses[id].department}
                number={courses[id].number}
              ></CourseItem>
            ))}
          </View>
        }
      ></DetailedSessionCard>
      <View>
        {start.getDay() == now.getDay() && //checking whether today's weekday is the same as session start day
        start.getHours() <= now.getHours() <= end.getHours() && //checking whether and now is between start & end's hours
        useAttending ? ( //only allow checkin/checkout visibility when using attending data
          selectedSession[1].attendingUID.includes(
            screenProps.profileProps.selectedUser.UID //checking whether attendedUID include current user. if so check-out, otherwise check-in
          ) ? (
            <Button
              onPress={async () => {
                await firebaseCheckOut();
                updateSelectedToSessions();
              }}
              title="Check Out"
            />
          ) : (
            <Button
              onPress={async () => {
                await firebaseCheckIn();
                updateSelectedToSessions();
              }}
              title="Check In"
            />
          )
        ) : (
          <Button disabled title="Register" /> //if not today's session, can only register? but this is disabled because unimplemented
        )}
      </View>
      <SafeAreaView>
        <Text>Attendees</Text>
        <SectionList
          sections={logVal("attendees", attendees)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Avatar.Text
              size={48}
              key={item}
              label={users[item].email.slice(0, 2).toUpperCase()}
            />
          )}
          renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
        />
      </SafeAreaView>
      <Refresher></Refresher>
    </View>
  );
}
