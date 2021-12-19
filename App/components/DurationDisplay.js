import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Card, Title, Paragraph, Subheading } from "react-native-paper";
const data = require("../data.json");

export default function DurationDisplay(props) {
  const start = new Date(props.start);
  const end = new Date(props.end);

  return (
    <TouchableOpacity>
      <Subheading>
        {start.getHours() % 12}:
        {start.getMinutes() > 10 ? start.getMinutes() : start.getMinutes() + "0"}{" to "}
        {end.getHours() % 12}:
        {end.getMinutes() > 10 ? end.getMinutes() : end.getMinutes() + "0"}{" "}
        {end.getHours() > 11 ? "PM" : "AM"}
      </Subheading>
    </TouchableOpacity>
  );
}
