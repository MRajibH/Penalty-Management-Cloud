// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBsZfJtaNvXZwXSXTwjCqud3gQ4F78wCwI",
//   authDomain: "penalty-management-cloud.firebaseapp.com",
//   projectId: "penalty-management-cloud",
//   storageBucket: "penalty-management-cloud.firebasestorage.app",
//   messagingSenderId: "83718134221",
//   appId: "1:83718134221:web:63627df2648ab3461c8c84",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBggdrjpGBt_Qvkc5ArelGoUMoTi-VVITg",
  authDomain: "test-a9361.firebaseapp.com",
  projectId: "test-a9361",
  storageBucket: "test-a9361.firebasestorage.app",
  messagingSenderId: "11528053120",
  appId: "1:11528053120:web:bced1c20ea0ab3aee16165",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const penaltyRef = doc(db, "penalty-management", "HNBX3RWogiKgHeGi12uq");

export const userRef = collection(db, "users");
export const roleRef = collection(db, "roles");
export const employeeRef = collection(db, "employee");
export const departmentRef = collection(db, "departments");
export const designationRef = collection(db, "designation");
export const penaltyCollectionRef = collection(db, "penalty-management");
