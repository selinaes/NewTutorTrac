import React, { useState, useEffect, useContext } from "react";
import {
  // access to Firestore storage features:
  getFirestore,
  // for storage access
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import {
  // access to Firebase storage features (for files like images, video, etc.)
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import StateContext from "./StateContext";

export default function Firestore(props) {
  const stateProps = useContext(StateContext);
  const firebaseProps = stateProps.firebaseProps;
  const auth = firebaseProps.auth;
  const db = firebaseProps.db;
  const storage = firebaseProps.storage;

  /***************************************************************************
     FIRESTORE CODE

    ***************************************************************************/

  async function addCourseDoc() {
    // Add a new document in collection "courses"
    await setDoc(doc(db, "courses", "2"), {
      department: "PSYC",
      number: "101",
    });
  }

  async function batchWriteOriginal() {
    // Get a new write batch
    const batch = writeBatch(db);

    // Set the values for 'courses'
    data.courses.forEach((course, index) => {
      const courseRef = doc(db, "courses", index.toString());
      batch.set(courseRef, {
        department: course.department,
        number: course.number,
      });
    });

    // Set the values for 'users'
    data.users.forEach((user) => {
      const userRef = doc(db, "users", user.UID.toString());
      batch.set(userRef, {
        classyear: user.classyear,
        email: user.email,
        name: user.name,
        courses: user.courses,
      });
    });

    // Set the values for 'sessions'
    data.sessions.forEach((session) => {
      const sessionRef = doc(db, "sessions", session.SID.toString());
      batch.set(sessionRef, {
        attendedUID: session.attendedUID,
        courses: session.courses,
        department: session.department,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        maxCapacity: session.maxCapacity,
        recurring: session.recurring,
        recurringDay: session.recurringDay,
        tutor: session.tutor,
        type: session.type,
      });
    });

    // Commit the batch
    await batch.commit();
  }
}
