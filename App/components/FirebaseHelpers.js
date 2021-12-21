import { initializeApp } from "firebase/app";
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
  limit,
  getDoc,
  writeBatch,
} from "firebase/firestore";


class FireDB {
  constructor(props) {
    this.config = {
      apiKey: "AIzaSyCtvvMpb2icR7di4hyGnD7Wg76hussiBYk",
      authDomain: "cs317-tutortrac.firebaseapp.com",
      projectId: "cs317-tutortrac",
      storageBucket: "cs317-tutortrac.appspot.com",
      messagingSenderId: "883004559565",
      appId: "1:883004559565:web:765c9894d3dbcfc0b19984",
      measurementId: "G-ZK9YEKDBDT",
    };

    const firebaseApp = initializeApp(this.config);
    this.auth = getAuth(firebaseApp);
    this.db = getFirestore(firebaseApp);
  }

  DB() {
    return this.db;
  }
    
  async add(doc, collection) {
    await addDoc(collection, doc);
  }

  async search(key, value, collection) {
    const q = query(collection, where(key, "==", value));
    
    let list = [];
    await getDocs(q).then(result => {
      result.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        list.push(doc.data());
        //console.log(list.length);
      });
    });
    return list;
  }

  async get(ID, collection) { 
    const results = await getDoc(doc(this.db, `${collection}/${ID}`));
    //results.forEach(x => console.log(x));
    //console.log(results.data());
    return results.data();
  }
  
  remove(ID, collection) { return }
  
  async update(ID, collection, newDoc) {
    await setDoc(doc(collection, ID), newDoc);
  }

  contains(key, value, collection) {
    const doc =  this.search(key, value, collection);
    return doc.exists();
  }
}

class Collection {
  constructor(FDB, name) {
    this.db = FDB;
    this.collectionName = name;
    this.collection = collection(this.db.DB(), name);
  }
    
  async add(doc) {
    await this.db.add(doc, this.collection);
  }

  get(ID) { 
    return this.db.get(ID, this.collectionName);
  }
  
  remove(ID) { 
    this.db.remove(ID, this.collection);
  }
  
  async update(ID, newDoc) {
    await this.db.update(ID, this.collection, newDoc);
  }

  async push(ID, data) {
    await this.contains("id", ID) ? await this.add(data) : await this.update(ID, data);
  }  

  async contains(key, value) {
    return await this.db.contains(key, value, this.collection);
  }
}

const DB = new FireDB();
const UserDB = new Collection(DB, "users");
const SessionDB = new Collection(DB, "sessions");
const CourseDB = new Collection(DB, "courses");

export { UserDB, SessionDB, CourseDB };
