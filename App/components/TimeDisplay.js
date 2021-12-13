import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Card, Title, Paragraph, Subheading } from "react-native-paper";
const data = require("../data.json");

export default function TimeDisplay(props) {
    const date = new Date(props.date)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <TouchableOpacity>
          <Subheading>{days[date.getDay()]} {date.getHours() % 12}:{date.getMinutes()>10? date.getMinutes(): date.getMinutes()+"0"} { date.getHours() > 11? "PM": "AM"}</Subheading>
    </TouchableOpacity>
  );
}
