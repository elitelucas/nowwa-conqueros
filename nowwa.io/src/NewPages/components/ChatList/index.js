import React, { useState } from "react";
import ChatListHeader from "../ChatListHeader";
import ChatInput from "../ChatInput";
import ChatContent from "../ChatContent";
import styles from "./ChatList.module.sass";

const ChatList = (props) => {
  return (
    <div className={styles.container}>
      <ChatListHeader selectedUser={props.selectedUser} />

      <ChatContent messages={props.messages} />

      <ChatInput sendMessage={props.sendMessage} />
    </div>
  );
};

export default ChatList;
