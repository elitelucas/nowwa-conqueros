import React, { useEffect, useState, useRef, useContext } from "react";
import ChatMsgTo from "../ChatMsgTo";
import ChatMsgFrom from "../ChatMsgFrom";
import ChatImgFrom from "../ChatImgFrom";
import styles from "./ChatContent.module.sass";
import { Box, CircularProgress } from "@mui/material";
import { ChatContext } from "../../contexts/ChatContext";

const ChatContent = () => {
  //conquer
  const { entries, myAvatarID, loadingEntries } = useContext(ChatContext)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [loadingEntries, entries]);

  return (
    <div
      className={styles.container}
    >
      {loadingEntries ?
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </Box>
        :
        entries.length ?
          entries.map((entry, index) => {
            if (entry.text)
              return entry.avatarID == myAvatarID ? (
                <ChatMsgFrom text={entry.text} timestamp={entry.timestamp} key={index} />
              ) : (
                <ChatMsgTo avatarID={entry.avatarID} text={entry.text} timestamp={entry.timestamp} key={index} />
              );
            if (entry.type == "image")
              return entry.side == "from" ? <ChatImgFrom /> : <ChatImgFrom />;
          }) :
          <Box sx={{ textAlign: 'center', padding: '20px' }}>
            <p> This is begin of messages</p>
          </Box>
      }
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContent;
