import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Add this line for Realtime Database
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIK_piYZ9ttfMmFYIotFNpcWe4qO_iLa4",
    authDomain: "sweekar-af756.firebaseapp.com",
    projectId: "sweekar-af756",
    storageBucket: "sweekar-af756.appspot.com",
    messagingSenderId: "984127079768",
    appId: "1:984127079768:web:5be10e9344efbf3e76d12d",
    measurementId: "G-RYNR8WMV90",
    databaseURL: "https://sweekar-af756-default-rtdb.firebaseio.com/" // Add Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app); // Initialize Realtime Database
const googleProvider = new GoogleAuthProvider();

// Export everything
export { googleProvider, signInWithPopup, database, auth, db };
