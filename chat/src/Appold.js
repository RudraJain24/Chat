import { useEffect, useState } from "react";

// import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import Button from "./components/Button";
import Channel from "./components/Channel"
import { async } from "@firebase/util";


// firebase.initializeApp({
//   apiKey: "AIzaSyDFg5RzvGGXsvz0yIBHrcj0G3M_YePztpM",
//   authDomain: "chat-eee92.firebaseapp.com",
//   projectId: "chat-eee92",
//   storageBucket: "chat-eee92.appspot.com",
//   messagingSenderId: "877574247810",
//   appId: "1:877574247810:web:1ea14a9d00098e8a2c2b9b"
// });

const firebaseConfig = {
  apiKey: "AIzaSyDFg5RzvGGXsvz0yIBHrcj0G3M_YePztpM",
  authDomain: "chat-eee92.firebaseapp.com",
  databaseURL:"http://chat-eee92.firebaseio.com",
  projectId: "chat-eee92",
  storageBucket: "chat-eee92.appspot.com",
  messagingSenderId: "877574247810",
  appId: "1:877574247810:web:1ea14a9d00098e8a2c2b9b"
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore();
const colRef = collection(db, 'messages');

console.log(colRef);



function App() {

  console.log()
//   getDocs(colRef)
//   .then((snapshot) =>{
//     console.log(snapshot.docs)
// })
  // const [user, setUser] = useState(() => auth.currentUser);
  const [user, setUser] = useState("");
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        setUser(user);
      } else{
        setUser(null);
      }
      if(initializing){
        setInitializing(false);
      }
  }, []);
  return unsubscribe;
  })

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

  const UserWithcreateUserWithEmailAndPassword = () =>{
    const user = prompt("Enter your Name.");
    setUser(user);

    try{
      const result = createUserWithEmailAndPassword(auth, user+"@gmail.com","123456");
      console.log(result);
    }
    catch(err){
      console.log(err);
    }
  }

  return (<>
    <div>
      {user ? (`Welcome to ${user}`) : (<Button onClick={UserWithcreateUserWithEmailAndPassword} >Get In</Button>)}     
      <Channel user={user} db={db}></Channel>
    </div></>
  );
}

export default App;
