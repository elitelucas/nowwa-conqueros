import React, { useEffect, useState, useRef, useContext } from "react";
import { IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Avatar from 'react-avatar';
import styles from "./my.module.sass";
import { ChatContext } from "../../contexts/ChatContext";
import date from 'date-and-time';

const ChatMsgTo = (props) => {
  //conquer
  const { getUserNamebyAvatarID } = useContext(ChatContext)

  return (
    <div id="chatMsgFrom" className={styles.container}>
      <div className={styles.container__avatar}>
        <Avatar name={getUserNamebyAvatarID(props.avatarID)} round={true} size={30} />
      </div>
      <div className={styles.container__message}>
        <span>{props.text}</span>

        {/* More Icon */}
        <div label="edit" style={{ display: "none" }}>
          <MoreHorizIcon className={styles.container__message__editButton} />
        </div>
      </div>
      <div className={styles.container__time}>{date.format(new Date(props.timestamp), 'HH:mm A')}</div>
    </div>
  );
};

export default ChatMsgTo;
