import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  Headline,
  Paragraph,
  BottomNavigation,
  Avatar,
  Appbar,
  Checkbox,
  RadioButton,
  Text,
  List,
} from "react-native-paper";
import {
  // for storage access
  collection,
  query,
  getDocs,
  getDoc,
  where,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf, logVal } from "../utils";
const data = require("../data.json");

export default function NewSessionScreen(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  const db = screenProps.firebaseProps.db;
  const courses = screenProps.firestoreProps.courses;
  const departments = screenProps.firestoreProps.departments;

  //on mount and unmount
  useEffect(() => {
    console.log("NewUserScreen did mount");
    fillInfoFromSelected();
    // getDepartments();
    return () => {
      // Anything in here is fired on component unmount.
      console.log("NewUserScreen did unmount");
      screenProps.selectedProps.setSelectedSession(null);
    };
  }, []);

  const [type, setType] = React.useState("");
  const [department, setDept] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [start, setStart] = React.useState(new Date(Date.now()));
  const [end, setEnd] = React.useState(new Date(Date.now()));
  const [checked, setChecked] = React.useState([]);
  let currSID = null;

  var days = ["U", "M", "T", "W", "R", "F", "S"]; //Start with Sunday, end with Saturday

  async function firebaseAddNewSession() {
    const docSnap = await getDoc(doc(db, "ids", "SID"));
    let next = docSnap.data().maxUsed + 1;

    await setDoc(doc(db, "sessions", next.toString()), {
      courses: checked,
      department: department,
      location: location,
      maxCapacity: capacity,
      recurring: true, //now set to arbitruary true
      recurringDay: days[new Date(start).getDay()],
      tutor: selectedProps.selectedUser.UID,
      type: type,
      startTime: start.toString(),
      endTime: end.toString(),
    });

    await updateDoc(doc(db, "ids", "SID"), {
      maxUsed: next,
    });

    currSID = next;
  }

  // async function firebaseUpdateSession() {
  //   const q = query(
  //     collection(db, "users"),
  //     where("email", "==", emailOf(loggedInUser))
  //   );
  //   const querySnapshot = await getDocs(q);

  //   let uid;
  //   querySnapshot.forEach((doc) => {
  //     uid = doc.id;
  //   });

  //   await updateDoc(doc(db, "users", uid), {
  //     name: name,
  //     classyear: logVal("classyear", classyear),
  //     courses: checked,
  //   });
  // }

  const [showSD, setShowSD] = useState(false);
  const [showST, setShowST] = useState(false);
  const [showED, setShowED] = useState(false);
  const [showET, setShowET] = useState(false);

  const onChangeSD = (event, selectedDate) => {
    const currentDate = logVal("SD selectedDate", selectedDate) || start;
    setShowSD(Platform.OS === "ios");
    setStart(currentDate);
  };

  const onChangeST = (event, selectedTime) => {
    const currentTime = selectedTime || start;
    setShowST(Platform.OS === "ios");
    setStart(currentTime);
  };

  const onChangeED = (event, selectedDate) => {
    const currentDate = logVal("ED selectedDate", selectedDate) || end;
    setShowED(Platform.OS === "ios");
    setEnd(currentDate);
  };

  const onChangeET = (event, selectedTime) => {
    const currentTime = selectedTime || end;
    setShowET(Platform.OS === "ios");
    setEnd(currentTime);
  };

  function fillInfoFromSelected() {
    if (selectedProps.selectedSession) {
      setType(selectedProps.selectedSession[1].type);
      setDept(selectedProps.selectedSession[1].department);
      setLocation(selectedProps.selectedSession[1].location);
      setCapacity(selectedProps.selectedSession[1].maxCapacity);
      setStart(new Date(selectedProps.selectedSession[1].startTime));
      setEnd(new Date(selectedProps.selectedSession[1].endTime));
      setChecked(selectedProps.selectedSession[1].courses);
      currSID = selectedProps.selectedSession[0];
    }
  }

  return (
    <View style={globalStyles.screen}>
      <Appbar.Header>
        <Appbar.Content title="Add/Modify Session" />
      </Appbar.Header>
      <ScrollView style={globalStyles.scrollView}>
        <View style={{ flex: 1 }}>
          <RadioButton.Group
            onValueChange={(newValue) => setType(newValue)}
            value={type}
          >
            <View style={globalStyles.labeledInput}>
              <Text style={globalStyles.inputLabel}>Type: </Text>
              <RadioButton value="OH" />
              <Text>Office Hours</Text>
            </View>
            <View style={globalStyles.labeledInput}>
              <RadioButton value="SI" />
              <Text>Supplemental Instruction</Text>
            </View>
            <View style={globalStyles.labeledInput}>
              <RadioButton value="Cafe" />
              <Text>Subject Cafe</Text>
            </View>
          </RadioButton.Group>

          <View style={globalStyles.labeledInput}>
            <Text style={globalStyles.inputLabel}>Department: </Text>
            <Picker
              selectedValue={department}
              style={styles.pickerStyles}
              mode={"dropdown"}
              onValueChange={(itemValue, itemIndex) => setDept(itemValue)}
            >
              {departments.map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </View>

          <View style={globalStyles.labeledInput}>
            <Text style={globalStyles.inputLabel}>Location: </Text>
            <TextInput
              placeholder="Enter location"
              style={globalStyles.textInput}
              value={location}
              onChangeText={(textVal) => setLocation(textVal)}
            />
          </View>
          <View style={globalStyles.labeledInput}>
            <Text style={globalStyles.inputLabel}>Capacity: </Text>
            <TextInput
              placeholder="Enter capacity"
              style={globalStyles.textInput}
              value={capacity}
              keyboardType="number-pad"
              onChangeText={(val) => setCapacity(val.toString())}
            />
          </View>

          <View style={globalStyles.labeledInput}>
            <Text style={globalStyles.inputLabel}>Date and Time: </Text>
            <Text>Start: {start.toString()}</Text>
            <View style={globalStyles.buttonHolder}>
              <Button onPress={() => setShowSD(true)} title="Set Start Date" />
              <Button onPress={() => setShowST(true)} title="Set Start Time" />
            </View>
            <Text>End: {end.toString()}</Text>
            <View style={globalStyles.buttonHolder}>
              <Button onPress={() => setShowED(true)} title="Set End Date" />
              <Button onPress={() => setShowET(true)} title="Set End Time" />
            </View>
            {showSD && (
              <DateTimePicker
                testID="dateTimePicker"
                value={start}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeSD}
              />
            )}
            {showST && (
              <DateTimePicker
                testID="dateTimePicker"
                value={start}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeST}
              />
            )}
            {showED && (
              <DateTimePicker
                testID="dateTimePicker"
                value={end}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeED}
              />
            )}
            {showET && (
              <DateTimePicker
                testID="dateTimePicker"
                value={end}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeET}
              />
            )}
          </View>
        </View>
        <Text style={globalStyles.inputLabel}>Associated Courses</Text>
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

      <View style={globalStyles.buttonHolder}>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={async () => {
            // UPDATE DATABASE HERE
            if (selectedProps.selectedSession) {
              //if has selected session, update
            } else {
              //no selected session (value=null), add new
              await firebaseAddNewSession();
            }
            props.navigation.navigate("Home");
          }}
        >
          <Text style={globalStyles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
            // UPDATE DATABASE HERE
            props.navigation.navigate("Home");
          }}
        >
          <Text style={globalStyles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerStyles: {
    width: "60%",
    backgroundColor: "white",
    color: "black",
  },
});
