import React from "react";
import GroupChatListHeader from "../GroupChatListHeader";
import ChatInput from "../ChatInput";
import ChatContent from "../ChatContent";
import styles from "./GroupChatList.module.sass";

const GroupChatList = () => {
  return (
    <div className={styles.container}>
      <GroupChatListHeader />

      <ChatContent />

      <ChatInput />
    </div>
  );
};

export default GroupChatList;
