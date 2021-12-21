import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity } from "react-native";
import {
  Headline,
  Paragraph,
  BottomNavigation,
  Avatar,
  Appbar,
  Checkbox,
} from "react-native-paper";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
const data = require("../data.json");

export default function NewUserScreen(props) {
  const screenProps = useContext(StateContext);
  const user = screenProps.signedInProps.selectedUser;

  const [checked, setChecked] = React.useState(user.courses);
  const [name, setName] = React.useState(user.name);
  const [classyear, setYear] = React.useState(user.classyear.toString());
  
  return (
    <View style={globalStyles.screen}>
      <Appbar.Header>
        <Appbar.Content title="Setup" />
      </Appbar.Header>
      <View style={globalStyles.labeledInput}>
          <Text style={globalStyles.inputLabel}>Name:</Text>
          <TextInput
            placeholder="Enter first and last names"
            style={globalStyles.textInput}
            value={name}
            onChangeText={(textVal) => setName(textVal)}
          />
        </View>
        <View style={globalStyles.labeledInput}>
          <Text style={globalStyles.inputLabel}>Class:</Text>
          <TextInput
            placeholder="Enter class year"
            style={globalStyles.textInput}
            value={classyear}
            onChangeText={(textVal) => setYear(textVal)}
          />
      </View>
      <Text style={globalStyles.inputLabel}>Current Courses</Text>
      <ScrollView style={globalStyles.scrollView}>
          <View style={globalStyles.courseContainer}>
          {data.courses.map((course, index) => (
            <TouchableOpacity key={index} onPress={() => {
              checked.includes(index) ?
                setChecked(checked.filter(course => course!= index)):
                setChecked([...checked, index]);
              }}>
              <CourseItem color={checked.includes(index)? "aliceblue" : "coral"}
                department={course.department}
                number={course.number}
                ></CourseItem>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

        <View style={globalStyles.buttonHolder}>
          <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
            /*let temp = user;
            temp['name'] = name;
            temp['classyear'] = classyear;
            temp['courses'] = checked;
            setUser(temp);*/
            // UPDATE DATABASE HERE
            props.navigation.navigate("Home")
          }}
          >
            <Text style={globalStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}
