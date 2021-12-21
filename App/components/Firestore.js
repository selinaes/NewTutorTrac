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
  getDoc,
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

function formatJSON(jsonVal) {
  // Lyn sez: replacing \n by <br/> not necessary if use this CSS:
  //   white-space: break-spaces; (or pre-wrap)
  // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
  return JSON.stringify(jsonVal, null, 2);
}
/***************************************************************************
     FIRESTORE REUSABLE CODE

    ***************************************************************************/

export async function addCourseDoc(db) {
  // Add a new document in collection "courses"
  await setDoc(doc(db, "courses", "2"), {
    department: "PSYC",
    number: "101",
  });
}

export async function firebaseGetSpecifiedUser(UID, db) {
  const docRef = doc(db, "users", UID.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log(
      `on firebaseget: specifieduser('${formatJSON(docSnap.data().name)}')`
    );
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("firebaseGetSpecifiedUser: No such document!");
  }
}

export async function batchWriteOriginal(db) {
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
