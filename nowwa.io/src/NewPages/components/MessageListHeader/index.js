import React, { useEffect, useState, useRef, useContext } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import styles from "./MessageHeader.module.sass";
import Icon from "../Icon";
import { ChatContext } from "../../contexts/ChatContext";

const MessageListHeader = () => {
  //chat context
  const { setShowNewRoomModal, rooms, setSearch } = useContext(ChatContext)

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__title_row}>
          <div>
            <span className={styles.header__title}>Rooms</span>
            <span className={styles.header__title_number}>{rooms.length}</span>
          </div>

          <div className={styles.header__title_new}>
            <OpenInNewIcon onClick={() => setShowNewRoomModal(true)} />
          </div>
        </div>

        <div className={styles.header__search}>
          <Icon className="searchicon" name="search" size="28" />
          <input
            className={styles.input}
            type="text"
            name="search"
            placeholder="Search"
            required
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default MessageListHeader;
