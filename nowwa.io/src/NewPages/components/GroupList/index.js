import React, { useState } from "react";
import FriendItem from "../Friend";
import styles from "./GroupList.module.sass";
import GradeIcon from "@mui/icons-material/Grade";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton } from "@mui/material";

const groupList = [
  {
    name: "GroupA",
    avatar: "/images/content/avatar-1.jpg",
    time: "00:33",
    lastMsg: "Why is it that players...",
    isTyping: false,
    state: "check",
    isActive: false,
  },
  {
    name: "GroupB",
    avatar: "/images/content/avatar-2.jpg",
    time: "00:33",
    lastMsg: "Why is it that players...",
    isTyping: false,
    state: "check",
    isActive: true,
  },
  {
    name: "GroupC",
    avatar: "/images/content/avatar-3.jpg",
    time: "00:33",
    lastMsg: "Why is it that players...",
    isTyping: false,
    state: "doublecheck",
    isActive: true,
    currentFriend: false,
  },
];

const GroupList = (props) => {
  const [list, setList] = useState(groupList);

  const itemClicked = (_index) => {
    let _list = list;
    _list.map((group, index) => {
      if (_index === index) {
        group.currentSelect = true;
      } else {
        group.currentSelect = false;
      }
    });
    setList([..._list]);
    props.chatViewUpdate("group");
  };

  return (
    <div className={styles.pin}>
      <div className={styles.pinBar}>
        <div className={styles.pinBar__name}>
          <GradeIcon className={styles.pinBar__name__icon} />
          <span>Pinned</span>
        </div>
        <IconButton aria-label="loadmore">
          <MoreHorizIcon className={styles.pinBar__name__more} />
        </IconButton>
      </div>
      <div className={styles.container}>
        <div className={styles.topGradient}></div>
        {list.map((friend, index) => {
          return (
            <FriendItem
              data={friend}
              key={index}
              index={index}
              itemClicked={itemClicked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GroupList;
