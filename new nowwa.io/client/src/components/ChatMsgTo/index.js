import React from "react";
import styles from "./ChatMsgTo.module.sass";

const ChatMsgTo = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__time}>09:30</div>
      <div className={styles.container__message}>{props.text}</div>
      <div className={styles.container__avatar}>
        <img src="/images/content/avatar-7.jpg" alt="Avatar" />
      </div>
    </div>
  );
};

export default ChatMsgTo;
