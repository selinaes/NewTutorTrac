import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, SectionList, Array } from "react-native";
import { Avatar } from "react-native-paper";
const data = require("../data.json");
import StateContext from "./StateContext.js";
import DetailedSessionCard from "./DetailedSessionCard.js";
import CourseItem from "./CourseItem.js";
import { globalStyles } from "../styles/globalStyles.js";

export default function DataDisplayScreen(props) { 
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  const attendsCourseLog = [];
  
  const attendees = selectedProps.courses.map(course => ({
    title: data.courses[course].department + " " + data.courses[course].number,
    data: selectedProps.attendedUID.filter((user) => {
      const attendsCourse = data.users[user - 1].courses.includes(course);
      if (attendsCourse) attendsCourseLog.push(user);
      return (attendsCourse)
    })
  }
  ));

  attendees.push({ title: "OTHER", data: selectedProps.attendedUID.filter(user => !attendsCourseLog.includes(user)) })
  
  const Item = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);
    
  return (
    <View style={globalStyles.screen}>
      <DetailedSessionCard
            subtitle={data.users[selectedProps.tutor - 1].name}
            title={
              selectedProps.type +
              ": " +
              data.courses[selectedProps.courses[0]].department +
              " " +
              (selectedProps.type == "Cafe"
                ? ""
                : data.courses[selectedProps.courses[0]].number)
            }
            data={selectedProps}
            content={
                  <View style={globalStyles.courseContainer}>
                {selectedProps.courses.map((id) => (
                  <CourseItem
                    key={id}
                    department={data.courses[id].department}
                    number={data.courses[id].number}
                  ></CourseItem>
                ))}
              </View>
            }
      ></DetailedSessionCard>
      <SafeAreaView>
        <SectionList
          sections={attendees}
          keyExtractor={(item) => item}
          renderItem={({ item }) =>
            <Avatar.Text
              size={48}
              key = {item}
              label={data.users[item - 1].email.slice(0, 2).toUpperCase()}
          />}
          renderSectionHeader={({ section: { title } }) => (
            <Text>{title}</Text>
          )}
        />
      </SafeAreaView>
      <Button title="Check In"></Button>
    </View>
  );
}

/*        <View>
        {selectedProps.attendedUID.map((UID) => (
          <Avatar.Text
            size={48}
            key={UID}
            label={data.users[UID - 1].email.slice(0, 2).toUpperCase()}
          />
        ))}
      </View>*/
