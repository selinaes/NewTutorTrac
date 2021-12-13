import React from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

//A single class chip component
export default function CourseItem(props) {
  return (
    <Chip style={styles.chip}>{props.department + " " + props.number}</Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    width: 120,
    margin: 3,
    textAlign: "center",
    backgroundColor: "white",
  },
});
