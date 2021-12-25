import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { globalStyles } from "../styles/globalStyles.js";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Headline, Paragraph, BottomNavigation } from "react-native-paper";
import DataDisplayScreen from "./DataDisplayScreen.js";
import StateContext from "./StateContext.js";
import SessionCard from "./SessionCard.js";
import SimplifiedSessionCard from "./SimplifiedSessionCard.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf, logVal } from "../utils";
const data = require("../data.json");

function SessionsList(props) {
  const screenProps = useContext(StateContext);
  //(screenProps)
  const sessionsProps = screenProps.sessionsProps;

  const courses = screenProps.firestoreProps.courses;
  const setCourses = screenProps.firestoreProps.setCourses;
  const users = screenProps.firestoreProps.users;
  const setUsers = screenProps.firestoreProps.setUsers;
  const sessions = screenProps.firestoreProps.sessions;
  const setSessions = screenProps.firestoreProps.setSessions;

  const today = new Date(Date.now()).getDay();

  /***************************************************************************
  SESSIONS FUNCTIONALITY CODE
   ***************************************************************************/
  var weeklySchedule = [0, 1, 2, 3, 4, 5, 6];
  const sessionList = Object.entries(sessions)
    .filter(([key, session]) =>
      sessionsProps.selectedUser.courses.some((c) =>
        session.courses.includes(c)
      )
    )
    .sort((a, b) => new Date(a[1].startTime) - new Date(b[1].startTime));
  const daySessions = weeklySchedule.map((x) =>
    sessionList.filter(
      ([key, session]) =>
        (new Date(session.startTime).getDay() - today + 1) % 7 == x
    )
  );

  return (
    <View style={globalStyles.screen}>
      <ScrollView style={globalStyles.scrollView}>
        <Headline>Today's Sessions</Headline>
        {daySessions[0].map(([key, session]) => {
          let index = parseInt(key);
          return (
            <SessionCard
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
              action={(session) => {
                screenProps.selectedProps.setSelectedSession([key, session]);
                props.navigation.navigate("Session Details");
              }}
              data={session}
              content={
                <View style={globalStyles.courseContainer}>
                  {session.courses.map((id) => (
                    <CourseItem
                      key={id}
                      department={courses[id].department}
                      number={courses[id].number}
                    ></CourseItem>
                  ))}
                </View>
              }
            ></SessionCard>
          );
        })}

        <Headline>Future Sessions</Headline>
        {daySessions.slice(1).map((day) =>
          day.map(([key, session]) => {
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
          })
        )}
      </ScrollView>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function SessionListScreen(props) {
  return (
    <Stack.Navigator
      initialRouteName="My Sessions"
      screenOptions={{ headerStyle: { backgroundColor: "#f1c40f" } }}
    >
      <Stack.Screen name="My Sessions" component={SessionsList} />
      <Stack.Screen name="Session Details" component={DataDisplayScreen} />
    </Stack.Navigator>
  );
}
