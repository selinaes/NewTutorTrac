import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
const data = require("../data.json");
import StateContext from "./StateContext.js";

export default function DataDisplayScreen(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

    return (
      <View>
        <View>{Object.entries(selectedProps).map(pair => <Text>{pair[0]}: {pair[1]}</Text>)}</View>
        <Button title="Check In"></Button>
      </View>
  );
}
