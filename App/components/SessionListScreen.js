import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { globalStyles } from "../styles/globalStyles.js";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DataDisplayScreen from "./DataDisplayScreen.js";
import StateContext from "./StateContext.js";
import SessionCard from "./SessionCard.js";
import CourseItem from "./CourseItem.js";
const data = require("../data.json");

function SessionsList(props) {
  const screenProps = useContext(StateContext);
  const sessionsProps = screenProps.sessionsProps;

  /***************************************************************************
   SESSIONS FUNCTIONALITY CODE
   ***************************************************************************/

  return (
    <View style={globalStyles.screen}>
      <ScrollView>
        {(data.sessions.filter(
          (session) => sessionsProps.selectedUser.courses.some(c => session.courses.includes(c))).sort(
            (a, b) => { (new Date(b.startTime) > new Date(a.startTime)) ? -1 : 1 })).map((session) => (
          <SessionCard
                subtitle={data.users[session.tutor - 1].name}
                title={
                  session.type + ": " + session.department
                }
                action={(session) => {
                  screenProps.selectedProps = session;
                  props.navigation.navigate("Session Details");
                }}
                data={session}
                content={ <View style={globalStyles.courseContainer}>
                    {session.courses.map((course) => (
                      <CourseItem
                        key={course}
                        department={data.courses[course].department}
                        number={data.courses[course].number}
                      ></CourseItem>
                    ))}
                  </View>}
        ></SessionCard>
        ))}
      </ScrollView>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function SessionListScreen(props) {
  return ( 
          <Stack.Navigator
      initialRouteName="Home"
          >
            <Stack.Screen name="Upcoming Sessions" component={SessionsList} />
            <Stack.Screen name="Session Details" component={DataDisplayScreen} />
          </Stack.Navigator>);
}
