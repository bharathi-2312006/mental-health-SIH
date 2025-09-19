import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your project's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-4wve5G4w0NTBdaseDg3lt4qq3FVf5TU",
  authDomain: "mental-health-app-cbe78.firebaseapp.com",
  projectId: "mental-health-app-cbe78",
  storageBucket: "mental-health-app-cbe78.appspot.com",
  messagingSenderId: "990665194268",
  appId: "1:990665194268:web:5d66008ac41c3bc6edd8d9",
  measurementId: "G-K764E282NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export the necessary modules
export { auth, db, googleProvider, facebookProvider };
