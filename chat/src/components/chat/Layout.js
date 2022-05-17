import React, { useState, useEffect, useContext } from 'react';

import { collection, onSnapshot, doc, setDoc, addDoc, serverTimestamp, query, where, getDocs, updateDoc, writeBatch } from 'firebase/firestore';

import Button from './Button';
import UserList from './UserList';
import UserSpecificChannel from './UserSpecificChannel';
import ChatNav from './ChatNav';

const Layout = (props) => {
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [toUser, setToUser] = useState(null);
    const [fromUser, setFromUser] = useState(props.user);
    const [usersList, setUsersList] = useState([]);
    const [selectedUser, SetSelectedUser] = useState(null);


    window.addEventListener("beforeunload", function (e) {
        updateDoc(doc(props.db, "users", props.user.id), {
            isOnline: false,
            isTyping: false
        });
        // var confirmationMessage = "hi";

        // (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        // return confirmationMessage;                            //Webkit, Safari, Chrome
    });


    useEffect(() => {
        // async function realTime() {
        const collectionRef = collection(props.db, "users");
        const q = query(collectionRef, where("email", "!=", props.user.email));

        // const docSnap = await getDocs(q);
        onSnapshot(q, (snapshot) => {
            // console.log(snapshot.docs)
            const data = snapshot.docs.map((doc) => ({ ...doc.data(), lastLogin: getTime(doc.data().lastLogin), id: doc.id }));

            // snapshot.forEach((doc) => {
            //     console.log(doc.data());
            // });
            // console.log(data);
            data.sort((a, b) => {
                // console.log(sort(a,b));
                if (a.isOnline == b.isOnline) {
                    return 0;
                } else if (a.isOnline) {
                    return -1;
                } else {
                    return 1;
                }
            });
            // console.log(data);
            setUsersList(data);
            // console.log(usersList);
            // toUser && setToUser(data.find((user)=>user.id === toUser.id));
            // ChangeMsgStatus();
            // setSentMsg(data);
        })
        // setUsersList(docSnap.docs.map((data)=>({ ...data.data(), id: data.id })));
        // console.log(usersList);

        // }

        // realTime()



        // UpdateToUser()
        // console.log("set online")

        updateDoc(doc(props.db, "users", props.user.id), {
            isOnline: true,
        });
        // console.log(props.user);


        return () => {
            updateDoc(doc(props.db, "users", props.user.id), {
                isOnline: false,
                isTyping: false
            });

            // console.log("set offline");
        }
    }, [])

    useEffect(() => {
        const collectionRef = collection(props.db, "messages");
        const q = query(collectionRef, where('toUser', '==', props.user.id), where('status', "==", 1));

        // const docSnap = await getDocs(q);
        onSnapshot(q, (snapshot) => {
            // console.log(snapshot.docs)
            if (snapshot.docs.length) {
                alert(`You have ${snapshot.docs.length} New Msgs.`);
                // Get a new write batch
                const batch = writeBatch(props.db);

                // Update the population of 'SF'
                snapshot.docs.map((msg)=>{
                    
                    const sfRef = doc(props.db, "messages", msg.id);
                    batch.update(sfRef, { "status": 2 });
                })
                // Commit the batch
                batch.commit();

            }
            // const data = snapshot.docs.map((doc) => ({ ...doc.data(), createdAt: getTime(doc.data().createdAt), id: doc.id }));
            // console.log(data);
        });


    }, [])

    const ChangeMsgStatus = async () => {

        const q2 = query(collection(props.db, 'messages'), where('fromUser', '==', props.user.id), where('status', "==", 1));
        onSnapshot(q2, (snapshot) => {
            console.log(snapshot.docs.length);
            if (snapshot.docs.length) {
                const data = snapshot.docs.map((document) => {
                    updateDoc(doc(props.db, "messages", document.id), { status: 2 });
                    return ({ ...document.data(), createdAt: getTime(document.data().createdAt), id: document.id })
                });
                console.log(data);
            }
        });

    }

    const UpdateToUser = () => {
        console.log(toUser);
    }

    // const AddNewMsg = async () => {

    //     const Message = prompt("Enter Your Message.");
    //     const data = {
    //         createdAt: serverTimestamp(),
    //         user: props.user,
    //         message: Message,
    //     }
    //     alert(Message);
    //     console.log(data);
    //     // await setDoc(doc(db, "messages", id),data)
    //     const docRef = await addDoc(collection(props.db, "messages"), data);
    //     console.log(docRef.id);
    // }

    const getTime = (timestamp) => {
        // if(timestamp.seconds){
        //     console.log("with sec");
        // }else{
        //     console.log("without sec");
        // }
        const Timestamp = new Date(timestamp * 1000);

        // console.log(timestamp.seconds);


        const Time = (Timestamp.getHours() > 12 ? Timestamp.getHours() - 12 : Timestamp.getHours()) + ":" + Timestamp.getMinutes();
        // console.log(Time);
        return Time;
    }

    // const UserSignOut = () => {
    //     setUser(null);
    //     setIsUserLoggedIn(false);
    //     console.log(user+isUserLoggedIn);
    //     // console.log(user);
    // }

    const Msg = (e) => {
        console.log(e.target.value);
        setNewMessage(e.target.value);
    }

    const SetToUser = (user) => {
        setToUser(user);
        // console.log(user);
        getChatHistory(user.id);
    }

    const getChatHistory = async (toUserId = toUser.id) => {
        const collectionRef = collection(props.db, "messages");
        // const collectionRef = props.db.collection('messages');
        // console.log(toUserId + "|" + fromUser);

        const qSent = query(collectionRef, where("toUser", "==", toUserId), where("fromUser", "==", fromUser.id));
        const qReceived = query(collectionRef, where("toUser", "==", fromUser.id), where("fromUser", "==", toUserId));

        const docSnapSent = await getDocs(qSent);
        const docSnapReceived = await getDocs(qReceived);
        // const querySnapshot = await getDocs(q);
        // docSnap.forEach((doc) => {console.log(doc.id, " => ", doc.data());});
        const Sentlist = docSnapSent.docs.map((doc) => ({ ...doc.data(), id: doc.id, label: "sent" }));
        const Receivedlist = docSnapReceived.docs.map((doc) => ({ ...doc.data(), id: doc.id, label: "received" }));

        // setMessage(list);
        console.log("Sent =>" + Sentlist);
        console.log("Received =>" + Receivedlist);

        const SortedChat = Sentlist.concat(Receivedlist).sort(function (a, b) {
            return a.createdAt.seconds - b.createdAt.seconds;
        });
        setMessage(SortedChat);

        // console.log(docSnap);
    }

    const SendMsg = async () => {
        const data = {
            toUser: toUser.id,
            fromUser: fromUser.id,
            message: newMessage,
            createdAt: serverTimestamp()
        }
        const docRef = await addDoc(collection(props.db, "messages"), data);
        console.log(docRef.id);
        getChatHistory();
    }

    return <>
        <ChatNav userSignOut={props.userSignOut} user={props.user} />
        {/* <div style={{display:"flex",justifyContent:"space-between"}}>
        <h1>Hi {props.userName}</h1>
        <Button onClick={props.userSignOut}> Sign Out</Button>
            </div> */}
        <div style={{ display: "flex", height: "538px" }}>
            <div style={{ width: "30vw", display: "flex", flexDirection: "column", padding: "10px" }}>
                {/* <div className='usersTitle'>Users</div> */}
                {/* <div > */}
                <UserList toUser={SetToUser} fromUser={fromUser} users={usersList} ></UserList>
                {/* </div> */}
            </div>
            <div style={{ width: "70vw", height: "inherit", display: "flex", flexDirection: "column", background: "#fef3f1" }}>
                <UserSpecificChannel toUser={toUser} fromUser={fromUser.id} db={props.db} />
            </div>
        </div>
    </>;
};

export default React.memo(Layout);
