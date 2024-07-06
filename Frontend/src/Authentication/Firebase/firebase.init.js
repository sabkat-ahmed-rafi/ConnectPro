// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARZTJg3uqrxRUhYMVK4Ulh_AeGwPZj-FU",
  authDomain: "connectpro-eb32a.firebaseapp.com",
  projectId: "connectpro-eb32a",
  storageBucket: "connectpro-eb32a.appspot.com",
  messagingSenderId: "476853660126",
  appId: "1:476853660126:web:59ffec868abe743eb1554f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;