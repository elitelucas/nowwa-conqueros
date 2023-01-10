import React, { useState } from "react";
import FriendItem from "../Friend";
import styles from "./FriendList.module.sass";

const friendList = [
  {
    name: "Smith",
    avatar: "/images/content/avatar-2.jpg",
    time: "00:33",
    lastMsg: "Why is it that players...",
    isTyping: true,
    state: "check",
    isActive: false,
  },
  {
    name: "Leonard",
    avatar: "/images/content/avatar-3.jpg",
    time: "00:33",
    lastMsg: "Why is it that players...",
    isTyping: true,
    state: "doublecheck",
    isActive: true,
    currentSelect: false,
  },
  {
    name: "Jacky",
    avatar: "/images/content/avatar-4.jpg",
    time: "00:33",
    lastMsg: "Why is it that players...",
    isTyping: false,
    state: "251",
    isActive: false,
  },
  {
    name: "Tom",
    avatar: "/images/content/avatar-5.jpg",
    time: "00:33",
    lastMsg: "Why is it that players...",
    isTyping: false,
    state: "check",
    isActive: false,
  },
];

const FriendList = (props) => {
  const { users } = props;
  const [list, setList] = useState(friendList);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const itemClicked = (_index) => {
    let _list = list;
    _list.map((friend, index) => {
      if (_index === index) {
        friend.currentSelect = true;
      } else {
        friend.currentSelect = false;
      }
    });
    setList([..._list]);
    props.chatViewUpdate("single");
  };

  const getLastMessage = (user) => {
    var allmessages = props.messages;
    var lastmsg;
    for (let i = 0; i < allmessages.length; i++) {
      const element = allmessages[i];
      if (element.with == user) {
        if (element.side == "from") lastmsg = element.data;
        else lastmsg = "You: " + element.data;
      }
    }
    return lastmsg;
  };

  return (
    <>
      <div className={styles.container}>
        {users.map((user, index) => {
          return (
            <FriendItem
              data={{
                name: user,
                avatar: "/images/content/avatar-0.jpg",
                time: "01:23",
                lastMsg: getLastMessage(user),
                isTyping: false,
                state: "check",
                isActive: true,
                currentSelect: selectedIndex == index,
              }}
              key={index}
              index={index}
              itemClicked={() => {
                setSelectedIndex(index);
                props.chatViewUpdate("single");
                props.selectedUserUpdate(user);
              }}
            />
          );
        })}
        {/* refer this style */}
        {/* {list.map((friend, index) => {
          return (
            <FriendItem
              data={friend}
              key={index}
              index={index}
              itemClicked={itemClicked}
            />
          );
        })} */}
      </div>
    </>
  );
};

export default FriendList;
