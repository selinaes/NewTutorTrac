import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import { globalStyles } from '../styles/globalStyles.js';
import StateContext from './StateContext.js';

export default function SignedInDisplay(props) {
  const screenProps = useContext(StateContext);
  const signedInProps = screenProps.signedInProps; 
  return(
    signedInProps.loggedInUser===null? null: // Only display this component if a user is signed in
    
    <View style={globalStyles.subComponentContainer}>
    <Text style={styles.counterText}>Signed in: {signedInProps.loggedInUser.email}</Text>
      <Button 
        title={'Sign Out'} 
        onPress={props.signOutUser}
      />
    </View>
    
  );
  }

const styles = StyleSheet.create({
  counterText: {
      fontSize: 20,
      textAlign: 'center',
      color: 'black',
  },
});