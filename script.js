// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDucECRPTguaczzjbaxv8Tjy_n2uYoR4fM",
  authDomain: "budgetdreams-4b58e.firebaseapp.com",
  projectId: "budgetdreams-4b58e",
  storageBucket: "budgetdreams-4b58e.firebasestorage.app",
  messagingSenderId: "842467931310",
  appId: "1:842467931310:web:89365e0815f1707e55293f",
  measurementId: "G-YWD4983XLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);