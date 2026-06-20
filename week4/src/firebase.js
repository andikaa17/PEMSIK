import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGAVTtDxZJ_oY3Sw6UsVVbcLXVLKlE0T4",
  authDomain: "pemsik-4617-backend.firebaseapp.com",
  projectId: "pemsik-4617-backend",
  storageBucket: "pemsik-4617-backend.firebasestorage.app",
  messagingSenderId: "508237885269",
  appId: "1:508237885269:web:2caf1e9c115d3272b449dc",
  measurementId: "G-5V4NF7N0L0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
