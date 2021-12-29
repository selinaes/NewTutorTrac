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
import { Appbar, RadioButton, Text, List } from "react-native-paper";
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
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import { formatJSON, emailOf, logVal } from "../utils";

export default function NewSessionScreen(props) {
  const screenProps = useContext(StateContext);
  const selectedProps = screenProps.selectedProps;

  const db = screenProps.firebaseProps.db;
  const courses = screenProps.firestoreProps.courses;
  const departments = screenProps.firestoreProps.departments;
  const firebaseGetSessions = screenProps.firestoreProps.firebaseGetSessions;

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

  const [currSID, setSID] = React.useState(null);
  function fillInfoFromSelected() {
    if (selectedProps.selectedSession) {
      setType(selectedProps.selectedSession[1].type);
      setDept(selectedProps.selectedSession[1].department);
      setLocation(selectedProps.selectedSession[1].location);
      setCapacity(selectedProps.selectedSession[1].maxCapacity.toString());
      setStart(new Date(selectedProps.selectedSession[1].startTime));
      setEnd(new Date(selectedProps.selectedSession[1].endTime));
      setChecked(selectedProps.selectedSession[1].courses);
      setSID(logVal("currSID", selectedProps.selectedSession[0]));
    }
  }

  const [type, setType] = React.useState("");
  const [department, setDept] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [start, setStart] = React.useState(new Date(Date.now()));
  const [end, setEnd] = React.useState(new Date(Date.now()));
  const [checked, setChecked] = React.useState([]);

  const [errorMsg, setErrorMsg] = React.useState("");

  useEffect(() => {
    if (checkNonEmpty()) setErrorMsg("");
  }, [type, checked, department, location, capacity, start, end]);

  function checkNonEmpty() {
    return (
      type !== "" &&
      department !== "" &&
      location !== "" &&
      capacity !== "" &&
      checked.length > 0
    );
  }

  var days = ["U", "M", "T", "W", "R", "F", "S"]; //Start with Sunday, end with Saturday

  async function firebaseAddNewSession() {
    const docSnap = await getDoc(doc(db, "ids", "SID"));
    let next = docSnap.data().maxUsed + 1;

    await setDoc(doc(db, "sessions", next.toString()), {
      courses: checked,
      department: department,
      location: location,
      maxCapacity: parseInt(capacity),
      recurring: true, //now set to arbitruary true
      recurringDay: days[new Date(start).getDay()],
      tutor: selectedProps.selectedUser.UID,
      type: type,
      startTime: start.toString(),
      endTime: end.toString(),
      attendedUID: [],
    });

    await updateDoc(doc(db, "ids", "SID"), {
      maxUsed: next,
    });
    setSID(next);
  }

  async function firebaseUpdateSession() {
    await updateDoc(doc(db, "sessions", logVal("docID", currSID.toString())), {
      courses: checked,
      department: department,
      location: location,
      maxCapacity: parseInt(capacity),
      recurringDay: days[new Date(start).getDay()],
      tutor: selectedProps.selectedUser.UID,
      type: type,
      startTime: start.toString(),
      endTime: end.toString(),
    });
    console.log("updated!");
  }

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

  return (
    <View style={globalStyles.screen}>
      <Appbar.Header>
        <Appbar.Content title="Add/Modify Session" />
      </Appbar.Header>
      <ScrollView style={globalStyles.scrollView}>
        <View style={{ flex: 2 }}>
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
              <Picker.Item label="Pick A Department" value="" />
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

          <View>
            <Text style={globalStyles.inputLabel}>Date and Time: </Text>
            <Text>Start: {start.toString()}</Text>
            <View style={globalStyles.buttonHolder}>
              <Button onPress={() => setShowSD(true)} title="Set Start Date" />
              <Button onPress={() => setShowST(true)} title="Set Start Time" />
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

            <Text>End: {end.toString()}</Text>
            <View style={globalStyles.buttonHolder}>
              <Button onPress={() => setShowED(true)} title="Set End Date" />
              <Button onPress={() => setShowET(true)} title="Set End Time" />
            </View>
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
              if (selectedProps.selectedSession) {
                //if has selected session, update
                await firebaseUpdateSession();
              } else {
                //no selected session (value=null), add new
                await firebaseAddNewSession();
              }
              await firebaseGetSessions();
              props.navigation.navigate("Home");
            } else {
              setErrorMsg("Please fill in all information fields!");
            }
          }}
        >
          <Text style={globalStyles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => {
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
