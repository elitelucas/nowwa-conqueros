import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./ChatInputState.module.sass";

const ChatInputState = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__avatar}>
          <img src="/images/content/avatar-1.jpg" alt="Avatar" />
        </div>
        <EditIcon className={styles.container__typingStateIcon} />
        <span className={styles.container__typing}>Leo is typing...</span>
      </div>
    </>
  );
};

export default ChatInputState;
