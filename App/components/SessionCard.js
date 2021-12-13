import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, Subheading } from "react-native-paper";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
const data = require("../data.json");


//copied from simplified sessions card, need to modify
export default function SessionCard(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  return (
    <TouchableOpacity>
      <Card style={styles.card} onPress={() => props.action(props.data)}>
        <Card.Content>
          <Subheading>{props.subtitle}</Subheading>
          <Title>{props.title}</Title>
          <Paragraph>{props.content}</Paragraph>
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
    textAlign: "center",
    backgroundColor: "white",
  },
});
