import React from "react";
import FriendList from "../FriendList";
import MessageListHeader from "../MessageListHeader";
import GroupList from "../GroupList";
import styles from "./MessageList.module.sass";
import { PropaneSharp } from "@mui/icons-material";

const MessageList = () => {
  return (
    <div className={styles.container}>
      <MessageListHeader />
      <div className={styles.container__friendList}>
        <FriendList />
      </div>
      {/* <GroupList chatViewUpdate={props.chatViewUpdate} /> */}
    </div>
  );
};

export default MessageList;
