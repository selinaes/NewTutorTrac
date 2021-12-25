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
import { Avatar } from "react-native-paper";
const data = require("../data.json");
import StateContext from "./StateContext.js";
import DetailedSessionCard from "./DetailedSessionCard.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf, logVal } from "../utils";
import { globalStyles } from "../styles/globalStyles.js";

const testDate = true;

export default function DataDisplayScreen(props) {
  const [dummy, setDummy] = React.useState(false);
  const screenProps = useContext(StateContext);
  const selectedSession = screenProps.selectedProps.selectedSession;
  const setSelectedSession = screenProps.selectedProps.setSelectedSession;
  /*setSelectedSession(data.sessions[screenProps.selectedProps - 1]);*/

  const courses = screenProps.firestoreProps.courses;
  const setCourses = screenProps.firestoreProps.setCourses;
  const users = screenProps.firestoreProps.users;
  const setUsers = screenProps.firestoreProps.setUsers;
  const sessions = screenProps.firestoreProps.sessions;
  const setSessions = screenProps.firestoreProps.setSessions;

  const attendsCourseLog = []; //all user attended who are registered for this class
  const attendees = selectedSession[1].courses.map((course) => ({
    title: courses[course].department + " " + courses[course].number, //the course they belong to
    data: selectedSession[1].attendedUID.filter((user) => {
      const attendsCourse = users[user].courses.includes(course); //a boolean, whether the attendedUID person take this course or not
      if (logVal("attendsCourse", attendsCourse)) attendsCourseLog.push(user);
      return attendsCourse;
    }),
  }));
  attendees.push({
    title: "OTHER",
    data: selectedSession[1].attendedUID.filter(
      (user) => !attendsCourseLog.includes(user) //people not in this class but attend anyway (due to fake data)
    ),
  });

  useEffect(() => {
    //console.log(`on mount: courses('${formatJSON(courses)}')`);
    console.log(selectedSession);
    return () => {
      // Anything in here is fired on component unmount.
      screenProps.selectedProps.resetSelectedSession();
    };
  }, []);

  const now = new Date(Date.now());
  const start = testDate ? now : new Date(selectedSession[1].startTime);
  const end = testDate ? now : new Date(selectedSession[1].endTime);

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
        {start.getDay() == now.getDay() &&
        start.getHours() <= now.getHours() <= end.getHours() ? ( //checking whether today's weekday is the same as session start day, and now is between start & end's hours
          selectedSession[1].attendedUID.includes(
            screenProps.profileProps.selectedUser.UID //checking whether attendedUID include current user. if so check-out, otherwise check-in
          ) ? (
            <Button
              onPress={() => {
                let temp = selectedSession;
                temp[1].attendedUID.splice(
                  temp[1].attendedUID.indexOf(
                    screenProps.profileProps.selectedUser.UID
                  ),
                  1
                ); //splice(start, deleteCount)
                setSelectedSession(temp);
                setDummy(!dummy);
              }}
              title="Check Out"
            />
          ) : (
            <Button
              onPress={() => {
                let temp = selectedSession;
                temp[1].attendedUID.push(
                  screenProps.profileProps.selectedUser.UID
                );
                setSelectedSession(temp);
                setDummy(!dummy);
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
          sections={attendees}
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
    </View>
  );
}
