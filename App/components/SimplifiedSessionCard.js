import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Subheading, Card, Title, Paragraph } from "react-native-paper";

//A single simplified session card
export default function SimplifiedSessionCard(props) {
  return (
    <TouchableOpacity>
      <Card style={styles.card}>
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
