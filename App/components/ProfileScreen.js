import React, { useContext } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
const data = require("../data.json");

export default function ProfileScreen(props) {
  const screenProps = useContext(StateContext);
  const profileProps = screenProps.profileProps;

  /***************************************************************************
     RENDERING PROFILE TAB
    ***************************************************************************/
  //  const colors=['aqua', 'bisque', 'coral', 'crimson', 'fuchsia',
  //  'gold',  'lime', 'orange', 'pink', 'plum', 'purple',
  //  'salmon', 'teal', 'wheat'];

  //  function colorSelect() {
  //   const [pokemon,setPokemon] = useState();
  //   const [selectedLanguage,setSelectedLanguage] = useState();
  //   const [color,setColor] = useState('plum');

  //   return (
  //      <View style={[globalStyles.screen, {backgroundColor: color}]}>
  //        <Picker
  //           style={globalStyles.pickerglobalStyles}
  //           mode='dropdown' // or 'dialog'; chooses mode on Android
  //           selectedValue={color}
  //           onValueChange={(itemValue, itemIndex) => setColor(itemValue)}>
  //           {colors.map(clr => <Picker.Item key={clr} label={clr} value={clr}/>)}
  //        </Picker>
  //      </View>
  //   );
  // }

  //  function testingUserSelection() {
  //  return (
  //   <View style={[globalStyles.screen]}>
  //     <Picker
  //        style={globalStyles.pickerglobalStyles}
  //        mode='dropdown' // or 'dialog'; chooses mode on Android
  //        selectedValue={selectedUser}
  //        onValueChange={(itemValue, itemIndex) => setSelectedUser(itemValue)}>
  //       <Picker.Item label="Pikachu" value="pikachu" />
  //       <Picker.Item label="Charmander" value="charmander" />
  //       <Picker.Item label="Squirtle" value="Squirtle" />
  //        {/* {fakeUsers.map(user => <Picker.Item key={user.name} label={user.name} value={user.name}/>)} */}
  //     </Picker>
  //   </View>
  //   );
  // }

  function displayPersonalInfo() {
    return (
      <View>
        <Text>Name: {profileProps.selectedUser.name}</Text>
        <Text>Email: {profileProps.selectedUser.email}</Text>
        <Text>Class Year: Class of {profileProps.selectedUser.classyear}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Text>Profiles Screen</Text>
      {/* <Text style={globalStyles.json}>props: {formatJSON(props)}</Text> */}
      {displayPersonalInfo()}
      <View style={globalStyles.courseContainer}>
        {data.courses.slice(1, 20).map((course) => (
          <CourseItem
            key={course}
            department={course.department}
            number={course.number}
          ></CourseItem>
        ))}
      </View>
      <View style={globalStyles.verticalButtonHolder}>
        <Button
          title="Go to SignInScreen"
          onPress={() => props.navigation.navigate("SignIn")}
        />
        <Button
          title="Go to Session List"
          onPress={() => props.navigation.navigate("SessionList")}
        />
        <Button
          title="Go back to first screen in stack"
          onPress={() => props.navigation.popToTop()}
        />
      </View>
    </View>
  );
}
