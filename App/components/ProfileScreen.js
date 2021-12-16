import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import {
  Headline,
  Paragraph,
  BottomNavigation,
  Avatar,
  Appbar,
} from "react-native-paper";
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
      <Appbar.Header>
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <ScrollView style={globalStyles.scrollView}>
        <Avatar.Text
          size={150}
          label={profileProps.selectedUser.email.slice(0, 2).toUpperCase()}
        />
        {displayPersonalInfo()}
        <Headline>Registered Courses</Headline>
        <View style={globalStyles.courseContainer}>
          {profileProps.selectedUser.courses.map((id) => (
            <CourseItem
              key={id}
              department={data.courses[id].department}
              number={data.courses[id].number}
            ></CourseItem>
          ))}
        </View>

        <Headline>Attended Sessions</Headline>
        <View style={globalStyles.courseContainer}>
          {data.sessions
            .filter((session) =>
              session.attendedUID.includes(profileProps.selectedUser.UID)
            )
            .map((session, index) => (
              <SimplifiedSessionCard
                key={index}
                subtitle={data.users[session.tutor].name}
                title={
                  session.type +
                  ": " +
                  data.courses[session.courses[0]].department +
                  " " +
                  (session.type == "Cafe"
                    ? ""
                    : data.courses[session.courses[0]].number)
                }
                content={session.startTime}
              ></SimplifiedSessionCard>
            ))}
        </View>

        <Headline>Hosted Sessions</Headline>
        <View style={globalStyles.courseContainer}>
          {data.sessions
            .filter(
              (session) => session.tutor === profileProps.selectedUser.UID
            )
            .map((session, index) => (
              <SimplifiedSessionCard
                key={index}
                subtitle={data.users[session.tutor - 1].name}
                title={
                  session.type +
                  ": " +
                  data.courses[session.courses[0]].department +
                  " " +
                  (session.type == "Cafe"
                    ? ""
                    : data.courses[session.courses[0]].number)
                }
                content={session.startTime}
              ></SimplifiedSessionCard>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
});
