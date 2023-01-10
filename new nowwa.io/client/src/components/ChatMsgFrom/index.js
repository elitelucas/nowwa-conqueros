import React from "react";
import { IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./ChatMsgFrom.module.sass";

const ChatMsgFrom = (props) => {
  return (
    <div id="chatMsgFrom" className={styles.container}>
      <div className={styles.container__avatar}>
        <img src="/images/content/avatar-1.jpg" alt="Avatar" />
      </div>
      <div className={styles.container__message}>
        <span>{props.text}</span>

        <div label="edit" style={{ display: "none" }}>
          <MoreHorizIcon className={styles.container__message__editButton} />
        </div>
      </div>
      {/* <IconButton aria-label="edit" style={{ display: "none" }}> */}

      {/* </IconButton> */}
      <div className={styles.container__time}>09:30</div>
    </div>
  );
};

export default ChatMsgFrom;
