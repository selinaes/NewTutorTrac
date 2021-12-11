import React, { useContext } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles.js';
import StateContext from './StateContext.js';

export default function SignInScreen(props) {
    const screenProps = useContext(StateContext);
    const signedInProps = screenProps.signedInProps
    return(
        <View style={globalStyles.screen}>
        {signedInProps.loginPane()}
        {signedInProps.displayStates()}
        </View>
    )
}

const styles = StyleSheet.create({
  signIn: {
      width: '90%',
      borderWidth: 1,
      borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
      borderColor: 'blue',
      backgroundColor: 'aliceblue',
      padding: 20,
  },
});