import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity } from "react-native";
import {Picker} from '@react-native-picker/picker';
import {
  Headline,
  Paragraph,
  BottomNavigation,
  Avatar,
  Appbar,
  Checkbox,
} from "react-native-paper";
import {
  // for storage access
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import DatePicker from 'react-native-date-picker';
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf } from "../utils";
const data = require("../data.json");

export default function NewSessionScreen(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  const db = screenProps.firebaseProps.db;
  const courses = screenProps.firestoreProps.courses;
  const setCourses = screenProps.firestoreProps.setCourses;

  console.log(selectedProps.selectedSession);

  const current = selectedProps.selectedSession;
  const [type, setType] = React.useState(current.type);
  const [location, setLocation] = React.useState(current.location);
  const [capacity, setCapacity] = React.useState(current.maxCapacity.toString());
  const [start, setStart] = React.useState(new Date(current.startTime));
  const [end, setEnd] = React.useState(new Date(current.endTime));
  const [checked, setChecked] = React.useState(current.courses);

  //on mount and unmount
  useEffect(() => {
    console.log("NewUserScreen did mount");
    firebaseGetCourses();
    //console.log(`on mount: courses('${formatJSON(courses)}')`);
    return () => {
      // Anything in here is fired on component unmount.
      console.log("NewUserScreen did unmount");
      screenProps.selectedProps.resetSelectedSession();
    };
  }, []);

  async function firebaseGetCourses() {
    const q = query(collection(db, "courses"));
    const querySnapshot = await getDocs(q);
    let courses = [];
    // unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      courses.push(doc.data());
    });
    // });
    // console.log(`on firebasegetCourses: courses('${formatJSON(courses)}')`);
    setCourses(courses);
  }
  
  return (
    <View style={globalStyles.screen}>
      <Appbar.Header>
        <Appbar.Content title="Modify Session" />
      </Appbar.Header>
      <ScrollView style={globalStyles.scrollView}>
      <View style={{ height: 400, width: 300 }}>
        <View style={globalStyles.labeledInput}>
          <Picker
            selectedValue={type}
            style={{ height: 200, width: 300 }}
            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
          >
            <Picker.Item label=" select session type" value="" />
            <Picker.Item label="Office Hours" value="OH" />
              <Picker.Item label="Supplemental Instruction" value="SI" />
              <Picker.Item label="Subject Cafe" value="Cafe" />
          </Picker>
        </View>
          <View style={globalStyles.labeledInput}>
            <Text style={globalStyles.inputLabel}>Location:</Text>
            <TextInput
              placeholder="Enter location"
              style={globalStyles.textInput}
            value={location}
              onChangeText={(textVal) => setLocation(textVal)}
            />
        </View>
        <View style={globalStyles.labeledInput}>
            <Text style={globalStyles.inputLabel}>Capacity:</Text>
            <TextInput
              placeholder="Enter capacity"
              style={globalStyles.textInput}
            value={capacity}
            keyboardType = "number-pad"
              onValueChange={(value) => setCapacity(value)}
            />
          </View>
      </View>
      <Text style={globalStyles.inputLabel}>Associated Courses</Text>
          <View style={globalStyles.courseContainer}>
          {courses.map((course, index) => (
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
          <Text style={globalStyles.buttonText}>Save</Text>
        </TouchableOpacity>
          <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
            /*let temp = user;
            temp['name'] = name;
            temp['classyear'] = classyear;
            temp['courses'] = checked;
            setUser(temp);*/
            // UPDATE DATABASE HERE
            props.navigation.navigate("Home");
          }}
          >
            <Text style={globalStyles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}
