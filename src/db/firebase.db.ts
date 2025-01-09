// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsZfJtaNvXZwXSXTwjCqud3gQ4F78wCwI",
  authDomain: "penalty-management-cloud.firebaseapp.com",
  projectId: "penalty-management-cloud",
  storageBucket: "penalty-management-cloud.firebasestorage.app",
  messagingSenderId: "83718134221",
  appId: "1:83718134221:web:63627df2648ab3461c8c84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const penaltyRef = doc(db, "penalty-management", 'HNBX3RWogiKgHeGi12uq');
export const penaltyCollectionRef = collection(db, "penalty-management");

