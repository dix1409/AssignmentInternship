// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB35YSXTB-4WdSwhZs80WO_NBI_qPTMhws",
  authDomain: "assignment-4679c.firebaseapp.com",
  projectId: "assignment-4679c",
  storageBucket: "assignment-4679c.appspot.com",
  messagingSenderId: "240086279168",
  appId: "1:240086279168:web:dd09e9cdb5c402fa5264e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db=getFirestore();

const storage=getStorage();

export {db,storage}
