import React from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

//A single class chip component
export default function CourseItem(props) {
    var styles = {
    flexDirection: "row",
    width: 110,
    margin: 3,
    textAlign: "center",
    backgroundColor: "coral"
  }
  if (props.color) {
    styles.backgroundColor = props.color;
  }

  return (
    <Chip style={styles}>{props.department + " " + props.number}</Chip>
  );
}
