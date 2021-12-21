import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
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

export default function SessionCard(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  return (
    <TouchableOpacity>
      <Card style={styles.card} onPress={() => props.action(props.data)}>
        <Card.Content>
          <Subheading>{props.subtitle}</Subheading>
          <Title>{props.title}</Title>
          <View>{props.content}</View>
          <TimeDisplay date={props.data.startTime} />
          <Text>{props.data.location}</Text>
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
