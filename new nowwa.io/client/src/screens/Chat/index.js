import React, { useEffect, useState, useRef, useContext } from "react";
import Leftbar from "../../components/Leftbar";
import MessageList from "../../components/MessageList";
import ChatList from "../../components/ChatList";
import GroupChatList from "../../components/GroupChatList";
import styles from "./Chat.module.sass";
import Box from "@mui/material/Box";
import io from "socket.io-client";
import ls from "local-storage";
import { ConquerContext } from "../../contexts/ConquerContext";

const Chat = () => {
  //conquer
  const { CONQUER } = useContext(ConquerContext)
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    if (!CONQUER) return;
    setRooms(CONQUER.Rooms.pool)
  }, [CONQUER]);

  //auth
  const [user, setUser] = useState("");
  //chat
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messages, setMessages] = useState([
    // { side: "to", type: "image", data: "/images/games/game2.png" },
    // { side: "to", type: "text", data: "Hello" },
    // { side: "from", type: "text", data: "Hi" },
  ]);
  //socket
  const socket = useRef();

  useEffect(() => {
    setUser(ls.get("user"));
  }, []);
  useEffect(() => {
    if (!user) return;
    initSocket();
  }, [user]);

  const initSocket = () => {
    socket.current = io.connect("/");
    socket.current.emit("myID", user);
    socket.current.on("allUsers", (users) => {
      handleallUsers(users);
    });
    socket.current.on("receiveMessage", (data) => {
      handleReceiveMessage(data);
    });
  };

  const handleallUsers = (users) => {
    var data = Object.keys(users);
    for (var i = 0; i < data.length; i++) {
      if (data[i] === user) {
        data.splice(i, 1);
      }
    }
    setUsers(data);
    if (data.length) setSelectedUser(data[0]);
    console.log("on allUsers", data);
  };

  const handleReceiveMessage = (data) => {
    setMessages((prev) => {
      return [
        ...prev,
        { side: "from", with: data.from, type: "text", data: data.text },
      ];
    });
  };

  const [isGroupChat, setIsGroupChat] = useState(false);

  useEffect(() => {
    const msgFromList = document.querySelectorAll("#chatMsgFrom");

    for (let i = 0; i < msgFromList.length; i++) {
      const element = msgFromList[i];
      element.addEventListener("mouseover", () => {
        const children = element.children;
        for (let j = 0; j < children.length; j++) {
          const child = children[j].children;
          for (let k = 0; k < child.length; k++) {
            const grandChild = child[k];
            if (grandChild.getAttribute("label") === "edit") {
              grandChild.style.display = "";
            }
          }
        }
      });
      element.addEventListener("mouseout", () => {
        const children = element.children;
        for (let j = 0; j < children.length; j++) {
          const child = children[j].children;
          for (let k = 0; k < child.length; k++) {
            const grandChild = child[k];
            if (grandChild.getAttribute("label") === "edit") {
              grandChild.style.display = "none";
            }
          }
        }
      });
    }
  }, []);

  const chatViewUpdate = (viewName) => {
    if (viewName === "group") {
      setIsGroupChat(true);
    } else {
      setIsGroupChat(false);
    }

    if (window.matchMedia("(max-width: 767px)").matches) {
      const chatEl = document.querySelector("#chatList");
      chatEl.style.display = "flex";
      const msgListEl = document.querySelector("#messageList");
      msgListEl.style.display = "none";
    } else {
      const chatEl = document.querySelector("#chatList");
      chatEl.style.display = "flex";
      const msgListEl = document.querySelector("#messageList");
      msgListEl.style.display = "flex";
    }
  };
  const selectedUserUpdate = (user) => {
    if (user != selectedUser) {
      setSelectedUser(user);
    }
  };

  const sendMessage = (text) => {
    setMessages((prev) => {
      return [
        ...prev,
        { side: "to", with: selectedUser, type: "text", data: text },
      ];
    });
    socket.current.emit("sendMessage", {
      from: user,
      to: selectedUser,
      text: text,
    });
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <Box className={styles.container__column_left}>
            <Leftbar />
          </Box>
          <Box id="messageList" className={styles.container__column_messages}>
            <MessageList
              chatViewUpdate={chatViewUpdate}
              selectedUserUpdate={selectedUserUpdate}
              users={users}
              messages={messages}
            />
          </Box>
          <Box id="chatList" className={styles.container__column_chat}>
            {isGroupChat ? (
              <GroupChatList />
            ) : (
              <ChatList
                sendMessage={sendMessage}
                messages={messages.filter((item) => item.with == selectedUser)}
                selectedUser={selectedUser}
              />
            )}
          </Box>
        </div>
      </div>
    </>
  );
};

export default Chat;
