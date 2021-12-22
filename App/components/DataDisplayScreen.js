import React, { useContext, useState } from "react";
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
import { globalStyles } from "../styles/globalStyles.js";

const testDate = true;

export default function DataDisplayScreen(props) {
  const [dummy, setDummy] = React.useState(false);
  const screenProps = useContext(StateContext);
  const selectedSession = screenProps.selectedProps.selectedSession;
  const setSelectedSession = screenProps.selectedProps.setSelectedSession;
  /*setSelectedSession(data.sessions[screenProps.selectedProps - 1]);*/
  console.log(selectedSession);
  const attendsCourseLog = [];
  const attendees = selectedSession.courses.map((course) => ({
    title: data.courses[course].department + " " + data.courses[course].number,
    data: selectedSession.attendedUID.filter((user) => {
      const attendsCourse = data.users[user - 1].courses.includes(course);
      if (attendsCourse) attendsCourseLog.push(user);
      return attendsCourse;
    }),
  }));
  attendees.push({
    title: "OTHER",
    data: selectedSession.attendedUID.filter(
      (user) => !attendsCourseLog.includes(user)
    ),
  });

    useEffect(() => {
    //console.log(`on mount: courses('${formatJSON(courses)}')`);
    return () => {
      // Anything in here is fired on component unmount.
      screenProps.selectedProps.resetSelectedSession();
    };
  }, []);

  const now = new Date(Date.now());
  const start = testDate ? now : new Date(selectedSession.startTime);
  const end = testDate ? now : new Date(selectedSession.endTime);

  return (
    <View style={globalStyles.screen}>
      <DetailedSessionCard
        subtitle={data.users[selectedSession.tutor - 1].name}
        title={
          selectedSession.type +
          ": " +
          data.courses[selectedSession.courses[0]].department +
          " " +
          (selectedSession.type == "Cafe"
            ? ""
            : data.courses[selectedSession.courses[0]].number)
        }
        data={selectedSession}
        content={
          <View style={globalStyles.courseContainer}>
            {selectedSession.courses.map((id) => (
              <CourseItem
                key={id}
                department={data.courses[id].department}
                number={data.courses[id].number}
              ></CourseItem>
            ))}
          </View>
        }
      ></DetailedSessionCard>
            <View>
        {start.getDay() == now.getDay() &&
        start.getHours() <= now.getHours() <= end.getHours() ? (
          selectedSession.attendedUID.includes(
            screenProps.profileProps.selectedUser.UID
          ) ? (
            <Button
                  onPress={() => {
                  let temp = selectedSession;
                  temp.attendedUID.splice(temp.attendedUID.indexOf(screenProps.profileProps.selectedUser.UID), 1);
                  setSelectedSession(temp);
                    setDummy(!dummy);
              }}
              title="Check Out"
            />
          ) : (
            <Button
                  onPress={() => {
                  let temp = selectedSession;
                    temp.attendedUID.push(screenProps.profileProps.selectedUser.UID);
                  setSelectedSession(temp);
                  setDummy(!dummy);
              }}
              title="Check In"
            />
          )
        ) : (
          <Button disabled title="Register" />
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
              label={data.users[item - 1].email.slice(0, 2).toUpperCase()}
            />
          )}
          renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
        />
      </SafeAreaView>
    </View>
  );
}
