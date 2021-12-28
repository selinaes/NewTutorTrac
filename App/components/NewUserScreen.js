import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Appbar } from "react-native-paper";
import {
  // for storage access
  collection,
  query,
  getDocs,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf, logVal } from "../utils";
// const data = require("../data.json");

export default function NewUserScreen(props) {
  const screenProps = useContext(StateContext);
  const loggedInUser = screenProps.signedInProps.loggedInUser;
  const selectedProps = screenProps.selectedProps;
  const db = screenProps.firebaseProps.db;
  const courses = screenProps.firestoreProps.courses;
  const users = screenProps.firestoreProps.users;
  const setUsers = screenProps.firestoreProps.setUsers;

  const [checked, setChecked] = React.useState([]);
  const [name, setName] = React.useState("");
  const [classyear, setYear] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  //on mount and unmount
  useEffect(() => {
    console.log("NewUserScreen did mount");
    fillInfoFromCurrent();
    return () => {
      // Anything in here is fired on component unmount.
      console.log("NewUserScreen did unmount");
    };
  }, []);

  useEffect(() => {
    if (checkNonEmpty()) setErrorMsg("");
  }, [name, checked, classyear]);

  function fillInfoFromCurrent() {
    if (selectedProps.selectedUser.hasOwnProperty("name")) {
      setChecked(selectedProps.selectedUser.courses);
      setName(selectedProps.selectedUser.name);
      setYear(selectedProps.selectedUser.classyear);
    }
  }

  function checkNonEmpty() {
    return name !== "" && classyear !== "" && checked.length > 0;
  }

  async function firebaseUpdateUser() {
    const q = query(
      collection(db, "users"),
      where("email", "==", emailOf(loggedInUser))
    );
    const querySnapshot = await getDocs(q);

    let uid;
    querySnapshot.forEach((doc) => {
      uid = doc.id;
    });

    await updateDoc(doc(db, "users", uid), {
      name: name,
      classyear: logVal("classyear", classyear),
      courses: checked,
    });
  }

  function updateSelectedUserToUsers() {
    let UID = selectedProps.selectedUser.UID.toString();
    let temp = JSON.parse(JSON.stringify(logVal("selectedProps.users", users)));
    temp[UID] = selectedProps.selectedUser;
    setUsers(temp);
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
          onChangeText={(val) => setYear(val.toString())}
        />
      </View>
      <Text style={globalStyles.inputLabel}>Current Courses</Text>
      <ScrollView style={globalStyles.scrollView}>
        <View style={globalStyles.courseContainer}>
          {Object.entries(courses).map(([key, course]) => {
            let index = parseInt(key);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  checked.includes(index)
                    ? setChecked(checked.filter((course) => course != index))
                    : setChecked([...checked, index]);
                }}
              >
                <CourseItem
                  color={checked.includes(index) ? "coral" : "aliceblue"}
                  department={course.department}
                  number={course.number}
                ></CourseItem>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View
        style={errorMsg === "" ? globalStyles.hidden : globalStyles.errorBox}
      >
        <Text style={globalStyles.errorMessage}>{errorMsg}</Text>
      </View>
      <View style={globalStyles.buttonHolder}>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={async () => {
            // UPDATE DATABASE HERE
            if (checkNonEmpty()) {
              await firebaseUpdateUser();
              selectedProps.setSelectedUser({
                name: name,
                classyear: classyear,
                courses: checked,
                email: emailOf(loggedInUser),
                UID: selectedProps.selectedUser.UID,
              });
              updateSelectedUserToUsers();
              props.navigation.navigate("Home");
            } else {
              setErrorMsg(
                "Please fill in both name and classyear, and select your courses!"
              );
            }
          }}
        >
          <Text style={globalStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
