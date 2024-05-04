import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyAT4br-aHgOeiP9Xv-cdDJ4Y-QZPi3YOdM",
  authDomain: "it-sysarch32-store-canete.firebaseapp.com",
  projectId: "it-sysarch32-store-canete",
  storageBucket: "it-sysarch32-store-canete.appspot.com",
  messagingSenderId: "963592956979",
  appId: "1:963592956979:web:1f0381145adda0756dc746",
  measurementId: "G-NQ486MJ28X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Use getAuth without passing any argument
export const googleProvider = new GoogleAuthProvider()
export { auth }; // Export the auth instance to be used in other parts of your application

export const db = getFirestore(app)