import React, { useState, useEffect, useContext } from 'react';

import { collection, onSnapshot, doc, setDoc, addDoc, serverTimestamp, query, where, getDocs, QuerySnapshot, orderBy, updateDoc } from 'firebase/firestore';

import { MdSend, MdWavingHand } from "react-icons/md";

import welcome from '../../assets/welcome.png'
import sent from '../../assets/sent.png'
import delivered from '../../assets/delivered.png'

// import Button from './Button';
// import UserList from './UserList';
// import { db } from './FirebaseConfig';
// import { db } from './FirebaseConfig';

const UserSpecificChannel = (props) => {
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [toUser, setToUser] = useState(props.toUser);
    const [fromUser, setFromUser] = useState(props.fromUser);
    const [sentMsg, setSentMsg] = useState([]);
    const [receivedMsg, setReceivedMsg] = useState([]);

    console.log(props)

    useEffect(() => {
        // setFromUser(this.props.)
        // console.log(props.toUser.isTyping);
        if (props.toUser) {
            const sentq = query(collection(props.db, "messages"), where("toUser", "==", props.toUser.id), where("fromUser", "==", props.fromUser));
            onSnapshot(sentq, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                // snapshot.forEach((doc) => {
                //     console.log(doc.data());
                // });
                // console.log(data);
                setSentMsg(data);
            })
            const receivedq = query(collection(props.db, "messages"), where("toUser", "==", props.fromUser), where("fromUser", "==", props.toUser.id));
            onSnapshot(receivedq, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                // snapshot.forEach((doc) => {
                //     console.log(doc.data());
                // });
                // console.log(data);
                setReceivedMsg(data)
            })

        }
        // console.log(message);
    }, [props])

    useEffect(() => {
        SortChat();
    }, [sentMsg, receivedMsg])

    // const AddNewMsg = async () => {

    //     const Message = prompt("Enter Your Message.");
    //     const data = {
    //         createdAt : serverTimestamp(),
    //         user : props.userName,
    //         message : Message,
    //     }
    //     alert(Message);
    //     console.log(data);
    //     // await setDoc(doc(db, "messages", id),data)
    //     const docRef = await addDoc(collection(props.db, "messages"),data);
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
        // console.log(e);
        if (props.toUser.isOnline && !props.toUser.isTyping) {
            const docData = {
                isTyping: true,
                typingTo: props.toUser.id
            }
            updateDoc(doc(props.db, "users", props.fromUser), docData);
        }

        // console.log(e);
        setNewMessage(e.target.value);
    }

    const offTypingIndicator = () => {
        if (props.toUser.isOnline) {
            const docData = {
                isTyping: false,
                typingTo: null
            }
            updateDoc(doc(props.db, "users", props.fromUser), docData);
        }
    }

    const ToUser = async (user) => {
        setToUser(user);

        // getChatHistory(user.id);      
    }

    const SortChat = async () => {
        // const collectionRef = collection(props.db,"messages");
        // const collectionRef = props.db.collection('messages');
        // console.log(toUserId+"|"+fromUser);

        // const qSent = query(collectionRef,where("toUser","==",toUserId),where("fromUser","==",fromUser));
        // const qReceived = query(collectionRef,where("toUser","==",fromUser),where("fromUser","==",toUserId));

        // const docSnapSent = await getDocs(qSent);
        // const docSnapReceived = await getDocs(qReceived);
        // const querySnapshot = await getDocs(q);
        // docSnap.forEach((doc) => {console.log(doc.id, " => ", doc.data());});
        // const Sentlist = docSnapSent.docs.map((doc) => ({ ...doc.data(), id: doc.id, label: "sent" }));
        // const Receivedlist = docSnapReceived.docs.map((doc) => ({ ...doc.data(), id: doc.id, label: "received" }));

        // setMessage(list);
        // console.log("Sent =>"+sentMsg);
        // console.log("Received =>"+receivedMsg);

        const SortedChat = sentMsg.concat(receivedMsg).sort(function (a, b) {
            // console.log(a.createdAt.seconds);
            return a.createdAt.seconds - b.createdAt.seconds;
        });
        setMessage(SortedChat);

        // console.log(SortedChat);
    }

    const SendMsg = async () => {
        if(newMessage){
        const data = {
            toUser: props.toUser.id,
            fromUser: props.fromUser,
            message: newMessage,
            createdAt: serverTimestamp(),
            status:1 // status code 1-> sent, 2-> delivered, 3-> read
        }
        const docRef = await addDoc(collection(props.db, "messages"), data);
        offTypingIndicator();
        // console.log(docRef.id);
        // getChatHistory();
        setNewMessage("");
    }
    }

    return <>

        {props.toUser ? <>
            <div className="userName d-flex align-items-center">
                <div className="userImg m-2">{props.toUser.name.charAt(0)}</div>
                Chat with {props.toUser.name}</div>
            <div className='chatContainer'>
                {/* <div> */}
                {message.length == 0 ? <>
                    <div className='d-flex justify-content-center align-items-center' style={{ height: "100%" }}><span className="receivedMsg">Say "Hello" <MdWavingHand /> </span></div>
                </> :
                    <ul className='px-4'>
                        {message.map((message) =>
                        (
                            <>
                                {/* <div> */}
                                <li key={message.id} style={{ flexDirection: message.fromUser == props.fromUser ? "row-reverse" : "row", display: "flex" }} className='my-5' >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div className={message.fromUser == props.fromUser ? "sendMsg" : "receivedMsg"} >{message.message}</div>
                                        <div className='msgTime'>{getTime(message.createdAt)}</div>
                                        {
                                        (message.fromUser == props.fromUser) ? (
                                        <div className='d-flex align-items-center mx-2'><img src={(message.status===2)?delivered:sent} style={{height:"16px"}} /></div>
                                        ):""
                                    }
                                    </div>
                                </li>
                            </>
                        )


                        )}
                        {/* {props.toUser.isTyping} */}
                        {/* <div key={props.toUser.isTyping} > */}
                        {props.toUser.isOnline && props.toUser.isTyping && <li key="Typing Indicator" style={{ flexDirection: "row", display: "flex" }} className='my-5' >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div className="receivedMsg" ><div className="tiblock"> 
                                    <span className="tidot tidotChannel" ></span>
                                    <span className="tidot tidotChannel"></span>
                                    <span className="tidot tidotChannel"></span></div></div>
                                    {/* <span className='msgTime'>{getTime(message.createdAt)}</span> */}
                                </div>
                        </li>
                            }
                            {/* </div> */}

                    </ul>
                }
                {/* </div> */}
            </div>
            <div className='d-flex' >
                <input className="chatInputField" type="text" placeholder={`Type somthing...`} value={newMessage} onChange={(e) => Msg(e)} onBlur={() => offTypingIndicator()} onKeyDown={(e) => e.key === "Enter" ? SendMsg() : ""}></input>
                <button onClick={SendMsg} className='sendBtn' style={{color:"#f5548e"}}> <MdSend /></button>
            </div>
        </>
            : <div className='welcomeBanner'><span className='bannerHeading'>Let's have some chat.</span><img src={welcome} width="150px" /></div>}
    </>
};

export default React.memo(UserSpecificChannel);
