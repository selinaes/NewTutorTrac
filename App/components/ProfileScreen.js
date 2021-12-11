import React from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import SignedInDisplay from './SignedInDisplay.js';
import { globalStyles } from '../styles/globalStyles.js';

export default function ProfileScreen(props) {
    return (
      <View style={globalStyles.screen}>
        <Text>Profiles Screen</Text>
        {/* <Text style={globalStyles.json}>props: {formatJSON(props)}</Text> */}
        <View style={globalStyles.verticalButtonHolder}>
          <Button title="Go to SignInScreen" onPress={() => props.navigation.navigate('SignIn')} />
            <Button
            title="Go to Session List"
            onPress={() => props.navigation.navigate('SessionList')}/>
          <Button
            title="Go back to first screen in stack"
            onPress={() => props.navigation.popToTop()}
          />
      </View>
      </View>
    );
  }
