import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { Headline, Paragraph } from "react-native-paper";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import CourseItem from "./CourseItem.js";
import SimplifiedSessionCard from "./SimplifiedSessionCard.js";
const data = require("../data.json");

export default function ProfileScreen(props) {
  const screenProps = useContext(StateContext);
  const profileProps = screenProps.profileProps;

  /***************************************************************************
   USERS FUNCTIONALITY CODE
   ***************************************************************************/

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
        <Paragraph>Name: {profileProps.selectedUser.name}</Paragraph>
        <Paragraph>Email: {profileProps.selectedUser.email}</Paragraph>
        <Paragraph>
          Class Year: Class of {profileProps.selectedUser.classyear}
        </Paragraph>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <ScrollView style={globalStyles.scrollView}>
        {/* <Text style={globalStyles.json}>props: {formatJSON(props)}</Text> */}
        <Headline>Personal Profile</Headline>
        {displayPersonalInfo()}
        <Headline>Registered Courses</Headline>
        <View style={globalStyles.courseContainer}>
          {data.courses.slice(1, 5).map((course) => (
            <CourseItem
              key={course}
              department={course.department}
              number={course.number}
            ></CourseItem>
          ))}
        </View>
        <Headline>Attended Sessions</Headline>
        <View style={globalStyles.courseContainer}>
          {data.sessions.slice(0, 2).map((session) => (
            <SimplifiedSessionCard
              subtitle={data.users[session.tutor].name}
              title={
                session.type +
                ": " +
                session.courses.map(
                  (index) =>
                    data.courses[index].department + data.courses[index].number
                )
              }
              content={session.startTime}
            ></SimplifiedSessionCard>
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
      </ScrollView>
    </View>
  );
}
