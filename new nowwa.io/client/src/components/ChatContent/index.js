import React, { useEffect, useState, useRef, useContext } from "react";
import ChatMsgTo from "../ChatMsgTo";
import ChatMsgFrom from "../ChatMsgFrom";
import ChatImgFrom from "../ChatImgFrom";
import styles from "./ChatContent.module.sass";
import { ChatContext } from "../../contexts/ChatContext";

const ChatContent = () => {
  //conquer
  const { entries, myAvatarID } = useContext(ChatContext)

  return (
    <div
      className={styles.container}
    >
      {entries.map((entry, index) => {
        if (entry.text)
          return entry.avatarID == myAvatarID ? (
            <ChatMsgFrom text={entry.text} timestamp={entry.timestamp} key={index} />
          ) : (
            <ChatMsgTo text={entry.text} timestamp={entry.timestamp} key={index} />
          );
        if (entry.type == "image")
          return entry.side == "from" ? <ChatImgFrom /> : <ChatImgFrom />;
      })}
      {/* to test image */}
      {/* <ChatImgFrom />   */}
    </div>
  );
};

export default ChatContent;
