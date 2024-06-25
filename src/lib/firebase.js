// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "react-chat-app-708d4.firebaseapp.com",
  projectId: "react-chat-app-708d4",
  storageBucket: "react-chat-app-708d4.appspot.com",
  messagingSenderId: "726805290481",
  appId: "1:726805290481:web:6c4de1cb4cfde8dc003850",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
