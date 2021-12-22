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
import {
  // for storage access
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf } from "../utils";
const data = require("../data.json");

export default function NewUserScreen(props) {
  const screenProps = useContext(StateContext);
  const user = screenProps.signedInProps.selectedUser;
  const db = screenProps.firebaseProps.db;
  const courses = screenProps.firestoreProps.courses;
  const setCourses = screenProps.firestoreProps.setCourses;

  const [checked, setChecked] = React.useState(user.courses);
  const [name, setName] = React.useState(user.name);
  const [classyear, setYear] = React.useState(user.classyear.toString());

  //on mount and unmount
  useEffect(() => {
    console.log("NewUserScreen did mount");
    firebaseGetCourses();
    console.log(`on mount: courses('${formatJSON(courses)}')`);
    return () => {
      // Anything in here is fired on component unmount.
      console.log("NewUserScreen did unmount");
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
          keyboardType="number-pad"
            onValueChange={(val) => setYear(val)}
          />
      </View>
      <Text style={globalStyles.inputLabel}>Current Courses</Text>
      <ScrollView style={globalStyles.scrollView}>
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
            <Text style={globalStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}
