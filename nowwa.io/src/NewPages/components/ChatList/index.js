import React, { useState } from "react";
import ChatListHeader from "../ChatListHeader";
import ChatInput from "../ChatInput";
import ChatContent from "../ChatContent";
import styles from "./ChatList.module.sass";

const ChatList = () => {
  return (
    <div className={styles.container}>
      <ChatListHeader />
      <ChatContent />
      <ChatInput />
    </div>
  );
};

export default ChatList;
