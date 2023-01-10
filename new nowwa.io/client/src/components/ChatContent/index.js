import React, { useEffect, useState, useRef, Suspense } from "react";
import ChatMsgFrom from "../ChatMsgFrom";
import ChatMsgTo from "../ChatMsgTo";
import ChatImgFrom from "../ChatImgFrom";
import styles from "./ChatContent.module.sass";

const ChatContent = (props) => {

  return (
    <div
      className={styles.container}
    >
      {props.messages.map((message, index) => {
        if (message.type == "text")
          return message.side == "from" ? (
            <ChatMsgFrom text={message.data} />
          ) : (
            <ChatMsgTo text={message.data} />
          );
        if (message.type == "image")
          return message.side == "from" ? <ChatImgFrom /> : <ChatImgFrom />;
      })}
    </div>
  );
};

export default ChatContent;
