import { createContext, useContext, useEffect, useState } from "react";

// import firebase from "firebase/compat/app";
// import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, doc, where, query } from 'firebase/firestore';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { getDatabase, ref, onValue } from 'firebase/database';
import { Container, Button, Card } from "react-bootstrap";

import { auth, db } from "./FirebaseConfig";
import Layout from "./Layout";
import './index.css';

// import Button from "./components/Button";
// firebase.initializeApp({
//   apiKey: "AIzaSyDFg5RzvGGXsvz0yIBHrcj0G3M_YePztpM",
//   authDomain: "chat-eee92.firebaseapp.com",
//   projectId: "chat-eee92",
//   storageBucket: "chat-eee92.appspot.com",
//   messagingSenderId: "877574247810",
//   appId: "1:877574247810:web:1ea14a9d00098e8a2c2b9b"
// });

// const firebaseConfig = {
//   apiKey: "AIzaSyDFg5RzvGGXsvz0yIBHrcj0G3M_YePztpM",
//   authDomain: "chat-eee92.firebaseapp.com",
//   // databaseURL:"https://chat-eee92.firebaseio.com",
//   projectId: "chat-eee92",
//   storageBucket: "chat-eee92.appspot.com",
//   messagingSenderId: "877574247810",
//   appId: "1:877574247810:web:1ea14a9d00098e8a2c2b9b"
// }

// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
// const db = getFirestore();
// const db = getDatabase();




const Chat = () => {


  // const starCountRef = ref(db, 'messages/');
  // onValue(starCountRef, (snapshot) => {
  //   const data = snapshot.val();
  //   console.log(data);
  // updateStarCount(postElement, data);
  //   getDocs(colRef)
  //   .then((snapshot) =>{
  //     console.log(snapshot.docs)
  // })
  // const [user, setUser] = useState(() => auth.currentUser);
  const [user, setUser] = useState(null);
  // const [userName, setUserName] = useState(null);
  // const [userLoggedIn,setUserLoggedIn] = useState(false);

  // const [initializing, setInitializing] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if(user) {
  //       setUser(user);
  //     } else{
  //       setUser(null);
  //     }
  //     if(initializing){
  //       setInitializing(false);
  //     }
  // }, []);
  // return unsubscribe;
  // })

  // const signInWithGoogle = async () => {
  //   const provider = new auth.GoogleAuthProvider();
  //   auth.useDeviceLanguage();
  // try {
  //   await auth.signInwithPopup(provider) ;
  // } catch (error) {
  // console.error(error);
  // }
  // }

  // if (initializing) return "Loading...";

  // const UserWithcreateUserWithEmailAndPassword = () =>{
  //   const user = prompt("Enter your Name.");
  //   setUser(user);

  //   try{
  //     const result = createUserWithEmailAndPassword(auth, user+"@gmail.com","123456");
  //     console.log(result);
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  // }

  const createNewUserWithGmail = async (user) => {

    const data = {
      email: user.email,
      name: user.displayName,
      img: user.photoURL,
      lastLogin: serverTimestamp(),
    }
    const docRef = await addDoc(collection(db, "users"), data);
    data.id = docRef.id;

    setUser(data);

  }

  const createNewUserWithMail = async (user) => {

    const name = prompt("New User -- Enter your Name");
    const password = prompt("Set Password");

    // const auth = getAuth(app);

    // for authentication 
    try {
      const result = createUserWithEmailAndPassword(auth, user.email, password);
      console.log(result);
    }
    catch (err) {
      console.log(err);
    }

    // for user collection
    const data = {
      email: user.email,
      name: name,
      img: null,
      lastLogin: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "users"), data);
    data.id = docRef.id;
    // console.log(docRef);

    setUser(data);

  }

  // const setUser = (user) => {

  //   setUser(user);
  //   // setUserName(userName);
  //   // setUserLoggedIn(true);

  // }

  const CheckUser = async (user, loginType) => {
    console.log(user.email + "|" + loginType);
    // const docRef2 = doc(db, "users",{email: "rahulmjain154@gmail.com"});
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("email", "==", user.email));

    const docSnap = await getDocs(q);
    // console.log(docSnap);

    if (docSnap.docs.length === 0) {

      loginType === "google" ? createNewUserWithGmail(user) : createNewUserWithMail(user);
    }

    let ExistingUser = {};

    docSnap.forEach((d) => {
      // console.log(data.data().email);
      ExistingUser = d.data();
      ExistingUser.id = d.id;

    })
    console.log(ExistingUser);
    setUser(ExistingUser);
  }

  const UserWithMail = () => {
    const mail = prompt("Enter your mail.");

    const data = {
      email: mail
    }

    CheckUser(data, "mail");
  }

  const UserWithGoogle = () => {
    // alert("h1");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // setUser(user.uid);
        // setUserName(user.displayName);
        // setUserLoggedIn(true);

        // check user exists or not

        CheckUser(user, "google");
        // console.log(userExistOrNot.data());

        // console.log(newUser);




        // console.log(docRef.id);

        // console.log(user);
        // ...
      }).catch((error) => {
        console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  const UserSignOut = () => {
    setUser(null);
    // setUserName(null);
    // setUserLoggedIn(false);
    signOut(auth).then(() => { console.log("Signout Successful.") }).catch(() => { console.log("Signout Failed.") });
  }

  return (<>
    {/* <UserList></UserList> */}
    {user ? (<><Layout user={user} db={db} userSignOut={UserSignOut} /></>) :
      (<>
        <Container className="device-height d-flex justify-content-center align-items-center">
          <Card body className="card-background" >
            <Button className="mx-2 button" onClick={UserWithGoogle} >Get in with Google</Button>
            <Button className="mx-2 button" onClick={UserWithMail} >Get in with Mail</Button>
          </Card>
        </Container>
      </>)}
  </>
  );
}

export default Chat;
