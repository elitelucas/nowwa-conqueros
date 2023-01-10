import React from "react";
import styles from "./Friend.module.sass";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EditIcon from "@mui/icons-material/Edit";

const FriendItem = (props) => {
  return (
    <div
      className={
        props.data.currentSelect ? styles.friendItemActive : styles.friendItem
      }
      onClick={() => {
        props.itemClicked(props.index);
      }}
    >
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img src={props.data.avatar} alt="Avatar" />
          {props.data.isActive && <div className={styles.active}></div>}
        </div>

        <div className={styles.friendState}>
          <div className={styles.friendState__friendName}>
            {props.data.name}
          </div>
          {props.data.isTyping ? (
            <div className={styles.friendState__typingIndicator}>
              <EditIcon
                className={styles.friendState__typingIndicator__editIcon}
              />
              <span>{props.data.name + " is typing..."}</span>
            </div>
          ) : (
            <div className={styles.friendState__lastMsg}>
              {props.data.lastMsg}
            </div>
          )}
        </div>

        <div className={styles.msgState}>
          <div className={styles.msgState__time}>{props.data.time}</div>
          {props.data.state === "check" && (
            <CheckIcon className={styles.msgState__check}></CheckIcon>
          )}
          {props.data.state === "doublecheck" && (
            <DoneAllIcon className={styles.msgState__check}></DoneAllIcon>
          )}
          {props.data.state !== "doublecheck" &&
            props.data.state !== "check" && (
              <div className={styles.msgState__unread}>{props.data.state}</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FriendItem;
