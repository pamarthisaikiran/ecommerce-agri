// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBCqTRlkWHINujkD8byEfFv0WI0M8pjkOA",
  authDomain: "sai123-54d82.firebaseapp.com",
  projectId: "sai123-54d82",
  storageBucket: "sai123-54d82.appspot.com",
  messagingSenderId: "657061317710",
  appId: "1:657061317710:web:ae5798b9a10066f9ab871f",
  measurementId: "G-B0NGD2BQRX"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
