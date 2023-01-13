import React, { useEffect, useState, useRef, useContext } from "react";
import Leftbar from "../../components/Leftbar";
import MessageList from "../../components/MessageList";
import ChatList from "../../components/ChatList";
import GroupChatList from "../../components/GroupChatList";
import styles from "./Chat.module.sass";
import Box from "@mui/material/Box";
import io from "socket.io-client";
import ls from "local-storage";
import { Button, Modal } from "@mui/material";
import NewRoom from "./NewRoom";
import { ConquerContext } from "../../contexts/ConquerContext";
import { ChatContext } from "../../contexts/ChatContext";

const Chat = () => {
  //conquer
  const { CONQUER, username } = useContext(ConquerContext)
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    if (!CONQUER) return;
    setRooms(CONQUER.Rooms.pool)
  }, [CONQUER]);

  //chat context
  const { showNewRoomModal, setShowNewRoomModal, isWelcomePage } = useContext(ChatContext)

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
          <Box id="messageList" className={styles.container__column_messages} >
            <MessageList
              chatViewUpdate={chatViewUpdate}
              selectedUserUpdate={selectedUserUpdate}
            />
          </Box>
          <Box id="chatList" className={styles.container__column_chat}>
            {isWelcomePage ?
              <Box sx={{ textAlign: 'center' }}>
                <h1 style={{ marginTop: '30vh', fontSize: '60px' }}>Welcome!</h1>
                <h1 style={{ marginTop: '10px', marginBottom: '15px' }}>{username}</h1>
                <Button
                  variant="contained" color="warning" size="large"
                  sx={{ borderRadius: '16px' }}
                  onClick={() => setShowNewRoomModal(true)}
                >Create Room</Button>
              </Box>
              :
              isGroupChat ?
                <GroupChatList />
                :
                <ChatList
                  sendMessage={sendMessage}
                  messages={messages.filter((item) => item.with == selectedUser)}
                  selectedUser={selectedUser}
                />
            }
          </Box>
          <Modal
            open={showNewRoomModal}
            onClose={() => {
              setShowNewRoomModal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={styles.newroommodal}>
              <NewRoom />
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Chat;
