import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, View, SectionList, Linking } from "react-native";
import { Avatar } from "react-native-paper";
import {
  Card,
  Title,
  Paragraph,
  Subheading,
  Surface,
} from "react-native-paper";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
const data = require("../data.json");
import TimeDisplay from "./TimeDisplay.js";
import DurationDisplay from "./DurationDisplay.js";
import DateDisplay from "./DateDisplay.js";
import { ProgressBar, Colors } from 'react-native-paper';

export default function DetailedSessionCard(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  return (
    <TouchableOpacity>
      <Card style={styles.card}>
        <Card.Content>
          <Avatar.Text
            size={52}
            label={(props.subtitle.split(" ")).map(name => name[0]).join("")}
          />
          <Subheading>{props.subtitle}</Subheading>
          <Title>{props.title}</Title>
          <View>{props.content}</View>
          <Text></Text>
          <Text></Text>
          <DateDisplay date={props.data.startTime} recurring={props.data.recurring}></DateDisplay>
          <DurationDisplay start={props.data.startTime} end={props.data.endTime} />
          <Text>{props.data.location}</Text>
          <Text></Text>
          <Text></Text>
          <ProgressBar progress={(props.data.attendedUID.length) / (props.data.maxCapacity)} />
          <Text>{props.data.maxCapacity - props.data.attendedUID.length} seats open</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  //doesn't seem to be working as I expected
  card: {
    alignItems: "stretch",
    width: 300,
    margin: 3,
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "white",
  },
});
