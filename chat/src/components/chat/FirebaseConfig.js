import React from "react"; 

import {initializeApp as firebase} from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDFg5RzvGGXsvz0yIBHrcj0G3M_YePztpM",
    authDomain: "chat-eee92.firebaseapp.com",
    databaseURL: 'https://chat-eee92.firebaseio.com',
    projectId: "chat-eee92",
    storageBucket: "chat-eee92.appspot.com",
    messagingSenderId: "877574247810",
    appId: "1:877574247810:web:1ea14a9d00098e8a2c2b9b"
}

const app = firebase(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore();

export {auth, db, app};