import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getDatabase } from "firebase/database"; // Import Realtime Database

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID_KEY,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET_KEY,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGEINGSENDERID_KEY,
  appId: process.env.REACT_APP_FIREBASE_APPID_KEY,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID_KEY,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL_KEY,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export everything
export { app, auth, database };
