import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Appbar } from "react-native-paper";
import { globalStyles } from "../styles/globalStyles.js";
import StateContext from "./StateContext.js";
import SignedInDisplay from "./SignedInDisplay.js";
import {
  // access to authentication features:
  getAuth,
  // for email/password authentication:
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  // for logging out:
  signOut,
} from "firebase/auth";
import { doc, getDocs, query, where, collection } from "firebase/firestore";
import { formatJSON, emailOf, logVal } from "../utils";

const data = require("../data.json");

const selectSignedInUser = true;

export default function SignInScreen(props) {
  const [errorMsg, setErrorMsg] = React.useState("");
  const screenProps = useContext(StateContext);
  const signedInProps = screenProps.signedInProps;
  const selectedProps = screenProps.selectedProps;
  const auth = screenProps.firebaseProps.auth;
  const db = screenProps.firebaseProps.db;

  const email = signedInProps.email;
  const setEmail = signedInProps.setEmail;
  const password = signedInProps.password;
  const setPassword = signedInProps.setPassword;
  const loggedInUser = signedInProps.loggedInUser;
  const setLoggedInUser = signedInProps.setLoggedInUser;

  // component mount and unmount
  useEffect(() => {
    // Anything in here is fired on component mount.
    console.log("SignInScreen did mount");
    console.log(
      `on mount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`
    );
    console.log(`on mount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    checkEmailVerification();
    return () => {
      // Anything in here is fired on component unmount.
      console.log("SignInScreen did unmount");
      console.log(
        `on unmount: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`
      );
      console.log(`on unmount: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    };
  }, []);

  /***************************************************************************
     AUTHENTICATION CODE

    ***************************************************************************/

  // Clear error message when email is updated to be nonempty
  useEffect(() => {
    if (email != "") setErrorMsg("");
  }, [email]);

  function signUpUserEmailPassword() {
    console.log("called signUpUserEmailPassword");
    if (auth.currentUser) {
      signOut(auth); // sign out auth's current user (who is not loggedInUser,
      // or else we wouldn't be here
    }
    if (!email.includes("@wellesley.edu")) {
      setErrorMsg("Not a valid Wellesley email address");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password too short");
      return;
    }

    // Invoke Firebase authentication API for Email/Password sign up
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(
          `signUpUserEmailPassword: sign up for email ${email} succeeded (but email still needs verification).`
        );

        // Clear email/password inputs
        const savedEmail = email; // Save for email verification
        setEmail("");
        setPassword("");

        // Note: could store userCredential here if wanted it later ...
        // console.log(`createUserWithEmailAndPassword: setCredential`);
        // setCredential(userCredential);

        // Send verification email
        console.log(
          "signUpUserEmailPassword: about to send verification email"
        );
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("signUpUserEmailPassword: sent verification email");
          setErrorMsg(
            `A verification email has been sent to ${savedEmail}. You will not be able to sign in to this account until you click on the verification link in that email.`
          );
          // Email verification sent!
          // ...
        });
      })
      .catch((error) => {
        console.log(
          `signUpUserEmailPassword: sign up failed for email ${email}`
        );
        const errorMessage = error.message;
        // const errorCode = error.code; // Could use this, too.
        console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
        setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
      });
  }

  function signInUserEmailPassword() {
    console.log("called signInUserEmailPassword");
    console.log(
      `signInUserEmailPassword: emailOf(currentUser)0=${emailOf(
        auth.currentUser
      )}`
    );
    console.log(
      `signInUserEmailPassword: emailOf(loggedInUser)0=${emailOf(loggedInUser)}`
    );
    // Invoke Firebase authentication API for Email/Password sign in
    // Use Email/Password for authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(
          `signInUserEmailPassword succeeded for email ${email}; have userCredential for emailOf(auth.currentUser)=${emailOf(
            auth.currentUser
          )} (but may not be verified)`
        );
        console.log(
          `signInUserEmailPassword: emailOf(currentUser)1=${emailOf(
            auth.currentUser
          )}`
        );
        console.log(
          `signInUserEmailPassword: emailOf(loggedInUser)1=${emailOf(
            loggedInUser
          )}`
        );

        // Only log in auth.currentUser if their email is verified
        checkEmailVerification().then((user) => checkNewUser(user));

        // selectedProps.setSelectedUser(
        //   data.users.filter((user) => user.email === email)[0]
        // );

        // Clear email/password inputs
        //setEmail("");
        //setPassword("");

        // Note: could store userCredential here if wanted it later ...
        // console.log(`createUserWithEmailAndPassword: setCredential`);
        // setCredential(userCredential);
      })
      .catch((error) => {
        console.log(
          `signUpUserEmailPassword: sign in failed for email ${email}`
        );
        const errorMessage = error.message;
        // const errorCode = error.code; // Could use this, too.
        console.log(`signInUserEmailPassword: ${errorMessage}`);
        setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
      });
  }

  function checkEmailVerification() {
    if (auth.currentUser) {
      console.log(
        `checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`
      );
      return new Promise((resolve, reject) => {
        if (auth.currentUser.emailVerified) {
          console.log(
            `checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`
          );
          setLoggedInUser(auth.currentUser);
          console.log("checkEmailVerification: setErrorMsg('')");
          setErrorMsg("");
          resolve(auth.currentUser);
        } else {
          console.log("checkEmailVerification: remind user to verify email");
          setErrorMsg(
            `You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`
          );
          reject();
        }
      });
    }
  }

  async function checkNewUser(user) {
    let curUser = await firebaseGetCurrentUser(user);
    if (curUser) {
      selectedProps.setSelectedUser(curUser); //set selected user as this existing user
      props.navigation.navigate("Home");
    } else {
      props.navigation.navigate("Setup");
    }
  }

  async function firebaseGetCurrentUser(user) {
    const q = query(
      collection(db, "users"),
      where("email", "==", logVal("emailOf(loggedInUser)", emailOf(user)))
    );
    const querySnapshot = await getDocs(q);

    if (logVal("exists?", !querySnapshot.empty)) {
      let curUser = {};
      querySnapshot.forEach((doc) => {
        curUser = { ...doc.data(), UID: parseInt(doc.id) };
      });
      return logVal("curUser", curUser);
    } else {
      // doc.data() will be undefined in this case
      return false;
    }
  }

  function logOut() {
    console.log("logOut");
    console.log(
      `logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`
    );
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    console.log("logOut: signOut(auth)");
    selectedProps.setSelectedUser(data.users[0]);
    signOut(auth); // Will eventually set auth.currentUser to null
  }

  /***************************************************************************
   RENDERING AUTHENTICATION
   ***************************************************************************/

  function loginPane() {
    return (
      <View
        style={
          loggedInUser === null
            ? globalStyles.loginLogoutPane
            : globalStyles.hidden
        }
      >
        <View style={globalStyles.labeledInput}>
          <Text style={globalStyles.inputLabel}>Email:</Text>
          <TextInput
            placeholder="Enter an email address"
            style={globalStyles.textInput}
            value={email}
            onChangeText={(textVal) => setEmail(textVal)}
          />
        </View>
        <View style={globalStyles.labeledInput}>
          <Text style={globalStyles.inputLabel}>Password:</Text>
          <TextInput
            placeholder="Enter a password"
            style={globalStyles.textInput}
            value={password}
            onChangeText={(textVal) => setPassword(textVal)}
          />
        </View>
        <View style={globalStyles.buttonHolder}>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => signUpUserEmailPassword()}
          >
            <Text style={globalStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => signInUserEmailPassword()}
          >
            <Text style={globalStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View
          style={errorMsg === "" ? globalStyles.hidden : globalStyles.errorBox}
        >
          <Text style={globalStyles.errorMessage}>{errorMsg}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <Appbar.Header>
        <Appbar.Content title="Info" />
      </Appbar.Header>
      <ScrollView style={globalStyles.scrollView}>
        {loginPane()}
        <SignedInDisplay
          signOutUser={logOut}
          navigation={props.navigation}
        ></SignedInDisplay>
        {signedInProps.displayStates()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  signIn: {
    width: "90%",
    borderWidth: 1,
    borderStyle: "dashed", // Lyn sez: doesn't seem to work
    borderColor: "blue",
    backgroundColor: "aliceblue",
    padding: 20,
  },
});
