import React, {useState, useEffect} from "react";
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const globalStyles = StyleSheet.create({
    screen: {
      flex: 1,
      paddingTop: Constants.statusBarHeight,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
    }, 
    loginLogoutPane: {
        flex: 3, 
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    labeledInput: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    inputLabel: {
        fontSize: 20,
    }, 
    textInput: {
        width: "80%",
        fontSize: 20,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
    },
    buttonHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
  
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'blue',
        margin: 5,
    },
    buttonText: {
        fontSize: 20,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    errorBox: {
        width: '80%',
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'red',
    },
    errorMessage: {
        color: 'red',
        padding: 10, 
    },
    hidden: {
        display: 'none',
    },
    visible: {
        display: 'flex',
    },
    jsonContainer: {
        width: '98%',
        flex: 0.2,
        flexBasis:'auto',
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'blue',
    },
    json: {
        padding: 10, 
        color: 'blue', 
    },
    subComponentContainer: {
        flex: 1,
        padding: 10, 
        color: 'blue', 
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'coral',
        backgroundColor: 'pink',
      },
    pickerStyles:{
      width:'70%',
      backgroundColor:'gray',
      color:'black'
    },
    surface: {
      padding: 8,
      height: 80,
      width: 80,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    chip: {
      flexDirection: 'row',
      width: 100,
      margin: 3,
      textAlign: 'center',
      backgroundColor: "white",
    },
    courseContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "flex-start",
      alignItems:"flex-start",
      flexWrap:"wrap",
      backgroundColor: "gray",
      width: '90%'
    }
  });