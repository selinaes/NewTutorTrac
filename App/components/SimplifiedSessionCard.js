import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Subheading, Card, Title, Paragraph } from "react-native-paper";
import TimeDisplay from "./TimeDisplay.js";

//A single simplified session card
export default function SimplifiedSessionCard(props) {
  return (
    <TouchableOpacity>
      <Card style={styles.card}>
        <Card.Content>
          <Subheading>{props.subtitle}</Subheading>
          <Title>{props.title}</Title>
          <TimeDisplay date={props.content}/>
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
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "white",
  },
});
