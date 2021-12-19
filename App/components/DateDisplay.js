import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Card, Title, Paragraph, Subheading } from "react-native-paper";
const data = require("../data.json");

export default function DateDisplay(props) {
  const date = new Date(props.date);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return (
    <TouchableOpacity>
      <Subheading>
        {props.recurring ?
          "Every " + days[date.getDay()]:
          days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate()}
      </Subheading>
    </TouchableOpacity>
  );
}
