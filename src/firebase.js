// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Your Firebase configuration (copied from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyA-4wve5G4w0NTBdaseDg3lt4qq3FVf5TU",
  authDomain: "mental-health-app-cbe78.firebaseapp.com",
  projectId: "mental-health-app-cbe78",
  storageBucket: "mental-health-app-cbe78.appspot.com",   // ✅ FIXED HERE
  messagingSenderId: "990665194268",
  appId: "1:990665194268:web:5d66008ac41c3bc6edd8d9",
  measurementId: "G-K764E282NE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth setup
const auth = getAuth(app);

// ✅ Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
