import React from "react";
import FriendList from "../FriendList";
import MessageListHeader from "../MessageListHeader";
import GroupList from "../GroupList";
import styles from "./MessageList.module.sass";
import { PropaneSharp } from "@mui/icons-material";

const MessageList = (props) => {
  return (
    <div className={styles.container}>
      <MessageListHeader />
      <div className={styles.container__friendList}>
        <FriendList 
        chatViewUpdate={props.chatViewUpdate} 
        selectedUserUpdate={props.selectedUserUpdate} 
        users={props.users} 
        messages={props.messages} 
        />
      </div>
      <GroupList chatViewUpdate={props.chatViewUpdate} />
    </div>
  );
};

export default MessageList;
