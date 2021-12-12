import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import SessionCard from "./SessionCard.js";
const data = require("../data.json");

export default function SessionListScreen(props) {
  const screenProps = useContext(StateContext);
  const sessionsProps = screenProps.sessionsProps;

  /***************************************************************************
   SESSIONS FUNCTIONALITY CODE
   ***************************************************************************/

  return (
    <View style={globalStyles.screen}>
      <Text>Upcoming Sessions</Text>
      <ScrollView>
        {(data.sessions.filter(
          (session) => sessionsProps.selectedUser.courses.some(c => session.courses.includes(c))).sort(
            (a, b) => { (new Date(b.startTime) > new Date(a.startTime)) ? -1 : 1 })).map((session) => (
          <SessionCard
            subtitle={data.users[session.tutor - 1].name}
            title={
              session.type +
              ": " +
              session.courses.map(
                (index) =>
                  data.courses[index].department + data.courses[index].number
              )
            }
            content={session.startTime}
          ></SessionCard>
        ))}
      </ScrollView>
      <View style={globalStyles.verticalButtonHolder}>
        <Button
          title="Go to SignInScreen"
          onPress={() => props.navigation.navigate("SignIn")}
        />
        <Button
          title="Go to Profile"
          onPress={() => props.navigation.navigate("Profile")}
        />
        <Button
          title="Go back to first screen in stack"
          onPress={() => props.navigation.popToTop()}
        />
      </View>
    </View>
  );
}
