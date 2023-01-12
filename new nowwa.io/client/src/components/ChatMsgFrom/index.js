import React from "react";
import styles from "./my.module.sass";

const ChatMsgFrom = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__time}>{new Date(props.timestamp).toLocaleTimeString()}</div>
      <div className={styles.container__message}>{props.text}</div>
      <div className={styles.container__avatar}>
        <img src="/images/content/avatar-7.jpg" alt="Avatar" />
      </div>
    </div>
  );
};

export default ChatMsgFrom;
