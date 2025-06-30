// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCdxxvl5Ir0VHVlm62Gi_cXRTEbYots620",
  authDomain: "chat-app-web-eec6e.firebaseapp.com",
  projectId: "chat-app-web-eec6e",
  storageBucket: "chat-app-web-eec6e.firebasestorage.app",
  messagingSenderId: "1036308403173",
  appId: "1:1036308403173:web:75da4eb5e637b6189b950c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
