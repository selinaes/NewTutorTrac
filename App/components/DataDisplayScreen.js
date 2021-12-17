import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { Avatar } from "react-native-paper";
const data = require("../data.json");
import StateContext from "./StateContext.js";

export default function DataDisplayScreen(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  return (
    <View>
      <View>
        {Object.entries(selectedProps).map((pair) => (
          <Text key={pair}>
            {pair[0]}: {pair[1]}
          </Text>
        ))}
      </View>
      <View>
        {selectedProps.attendedUID.map((UID) => (
          <Avatar.Text
            size={48}
            key={UID}
            label={data.users[UID - 1].email.slice(0, 2).toUpperCase()}
          />
        ))}
      </View>
      <Button title="Check In"></Button>
    </View>
  );
}
