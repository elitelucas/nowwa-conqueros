import React, { useState, useEffect, useContext } from "react";
import FriendItem from "../Friend";
import styles from "./FriendList.module.sass";
import { CircularProgress, Box } from "@mui/material";
import { ChatContext } from "../../contexts/ChatContext";

const FriendList = () => {
  //conquer
  const { rooms, loadingRooms, onSelectRoom, currentRoomID, search } = useContext(ChatContext)

  return (
    <>
      <div className={styles.container}>
        {loadingRooms ?
          <Box sx={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress />
          </Box> :
          rooms.map((roomInstance, index) => {
            if (search == '' || roomInstance.name.toLowerCase().includes(search.toLowerCase()))
              return (
                <FriendItem
                  data={{
                    name: roomInstance.name,
                    avatar: "/images/content/avatar-0.jpg",
                    time: "", //
                    lastMsg: '',
                    isTyping: false,
                    // state: "3",
                    isActive: true,
                    selected: currentRoomID == roomInstance.roomID,
                  }}
                  key={index}
                  index={index}
                  itemClicked={() => {
                    onSelectRoom(roomInstance)
                  }}
                />
              );
          })}
      </div>
    </>
  );
};

export default FriendList;
