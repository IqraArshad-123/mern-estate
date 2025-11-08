// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4afb1.firebaseapp.com",
  projectId: "mern-estate-4afb1",
  storageBucket: "mern-estate-4afb1.firebasestorage.app",
  messagingSenderId: "289752190907",
  appId: "1:289752190907:web:86af9e7d47bd8536aa7e9e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);