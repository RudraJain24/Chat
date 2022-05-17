import React, { useState, useEffect, useMemo } from "react";
import { auth, db } from "./FirebaseConfig";
import { onSnapshot, collection, query, where, getDocs, orderBy } from "firebase/firestore";

const UserList = (props) => {

    // const [usersList, setUsersList] = useState([...props.users]);
    const [toUSer, setToUser] = useState([]);

    useEffect(() => {
    //     async function fetchMyAPI() {
    //         const collectionRef = collection(db, "users");
    //         const q = query(collectionRef, where("email", "!=", props.fromUser.email));
    //         onSnapshot(q, (snapshot) => {
    //             const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    //             data.sort((a, b) => {
    //                 if (a.isOnline == b.isOnline) {
    //                     return 0;
    //                 } else if (a.isOnline) {
    //                     return -1;
    //                 } else {
    //                     return 1;
    //                 }
    //             });
    //             setUsersList(data);
    //         })
    //     }

    //     fetchMyAPI()

    }, [props.users.isOnline])

    const SetToUser = (user) =>{
        setToUser(user);
        props.toUSer(user);
    }

    return <>
        <div className="userListContainer">
            <ul style={{ padding: "0px", margin: "0px" }}>
                {props.users.map((user) =>
                (

                    <li key={user.id} className="user" onClick={() => props.toUser(user)}>
                        <div ><span className="userImg">{(user.name).charAt(0)}</span></div>
                        <div className="userName">{user.name}</div>
                        {/* {user.isTyping} */}
                        <div className="ticontainer" >{user.isOnline ? user.isTyping && user.typingTo === props.fromUser.id ?<div className="tiblock"> <span className="tidot tidotList"></span>
    <span className="tidot tidotList"></span>
    <span className="tidot tidotList"></span></div>:<span className="onlineIndicator"></span> : <span className="msgTime">{user.lastLogin}</span>}</div>
                    </li>
                )


                )}

            </ul>
        </div>
    </>
}

export default React.memo(UserList);