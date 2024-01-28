import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef } from "firebase/database";
// import {
//   getAuth,
//   onAuthStateChanged,
//   setPersistence,
//   browserSessionPersistence,
// } from 'firebase/auth';
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
//import store from "./store/index.js";

// ... other firebase imports

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration.  This should be unique for each project.
import { firebaseConfig } from "./firebaseConfig.js";

export const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
setPersistence(auth, browserSessionPersistence).then(() => {});
export { auth };
// used for the database refs
export const db = getDatabase(firebaseApp);

// here we can export reusable database references
export const todosRef = dbRef(db, "todos");
