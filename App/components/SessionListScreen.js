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
const data = require("../data.json");

function SessionsList(props) {
  const screenProps = useContext(StateContext);
  console.log(screenProps)
  const sessionsProps = screenProps.sessionsProps;

  const today = 2; // new Date(now()).getDay

  /***************************************************************************
  SESSIONS FUNCTIONALITY CODE
   ***************************************************************************/
  var weeklySchedule = [0, 1, 2, 3, 4, 5, 6];
  const sessionList = data.sessions
    .filter((session) =>
      sessionsProps.selectedUser.courses.some((c) =>
        session.courses.includes(c)
      )
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const daySessions = weeklySchedule.map((x) =>
    sessionList.filter(
      (session) => (new Date(session.startTime).getDay() - today + 7) % 7 == x
    )
  );

  return (
    <View style={globalStyles.screen}>
      <ScrollView style={globalStyles.scrollView}>
        <Headline>Today's Sessions</Headline>
        {daySessions[0].map((session, index) => (
          <SessionCard
            key={index}
            subtitle={data.users[session.tutor - 1].name}
            title={
              session.type +
              ": " +
              data.courses[session.courses[0]].department +
              " " +
              (session.type == "Cafe"
                ? ""
                : data.courses[session.courses[0]].number)
            }
            action={(session) => {
              screenProps.selectedProps = session.SID;
              props.navigation.navigate("Session Details");
            }}
            data={session}
            content={
                  <View style={globalStyles.courseContainer}>
                {session.courses.map((id) => (
                  <CourseItem
                    key={id}
                    department={data.courses[id].department}
                    number={data.courses[id].number}
                  ></CourseItem>
                ))}
              </View>
            }
          ></SessionCard>
        ))}

        <Headline>Future Sessions</Headline>
        {daySessions
          .slice(1)
          .map((day) =>
            day.map((session, index) => (
              <SimplifiedSessionCard
                key={index}
                subtitle={data.users[session.tutor - 1].name}
                title={
                  session.type +
                  ": " +
                  data.courses[session.courses[0]].department +
                  " " +
                  (session.type == "Cafe"
                    ? ""
                    : data.courses[session.courses[0]].number)
                }
                content={session.startTime}
              ></SimplifiedSessionCard>
            ))
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
