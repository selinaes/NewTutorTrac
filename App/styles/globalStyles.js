import React, {useState, useEffect} from "react";
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const globalStyles = StyleSheet.create({
    screen: {
      flex: 1,
      paddingTop: 0,
      alignItems: "stretch",
      justifyContent: "space-between",
      backgroundColor: "#fff",
    },
    loginLogoutPane: {
        flex: 3, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    labeledInput: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap:"wrap",
    },
    loginInput: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputLabel: {
        fontSize: 20,
    },
    textInput: {
        width: "70%",
        fontSize: 20,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
    },
    buttonHolder: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verticalButtonHolder: {
        flexDirection: 'column',
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
    card: {
        marginBottom: 15,
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
    courseContainer: {
      flexDirection: 'row',
      justifyContent: "flex-start",
      alignItems:"flex-start",
      flexWrap:"wrap",
      backgroundColor: "white",
      width: '100%'
    },
    scrollView: {
        backgroundColor: 'white',
        marginHorizontal: 20,
      },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
  });
