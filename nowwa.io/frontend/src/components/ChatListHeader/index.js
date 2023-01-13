import React, { useState, useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatSetting from "../ChatSetting";
import styles from "./ChatListHeader.module.sass";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import LetteredAvatar from "lettered-avatar";
import { ChatContext } from "../../contexts/ChatContext";
import { ConquerContext } from "../../contexts/ConquerContext";

const ChatListHeader = () => {
  //conquer
  const { username } = useContext(ConquerContext)
  const { currentRoomInstance, currentRoomMemberNames } = useContext(ChatContext)

  const [showSetting, setShowSetting] = useState(false);
  const [spanWidth, setSpanWidth] = useState(25);

  const getMemmbersListString = () => {
    let string = ""
    currentRoomMemberNames.map((name, index) => {
      string += name + ", "
    })
    return string + "and you";
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__left}>
          <div className={styles.container__left__avatar}>
            <LetteredAvatar name={currentRoomInstance?.name} options={{ twoLetter: true }} />
          </div>
          <div className={styles.container__left__info}>

            <span className={styles.container__left__info__name}>{currentRoomInstance?.name}</span>

            <div className={styles.container__left__info__state}>
              <div className={styles.container__left__info__state__icon}>
                {(() => {
                  const arr = [];
                  for (let i = 0; i < currentRoomMemberNames.length; i++) {
                    arr.push(
                      <LetteredAvatar name={currentRoomMemberNames[i]} options={{ twoLetter: true }} key={i} />
                    );
                  }
                  return arr;
                })()}
              </div>
              <Tooltip title={<h2>{getMemmbersListString()}</h2>}>
                <div className={styles.container__left__info__state__stringActive}>
                  {currentRoomInstance?.avatarIDs.length} Members
                </div>
              </Tooltip>
            </div>

          </div>
        </div>

        <div className={styles.container__right}>
          <IconButton aria-label="loadmore">
            <MoreHorizIcon />
          </IconButton>

          <IconButton
            aria-label="setting"
            onClick={() => {
              if (window.matchMedia("(max-width: 767px)").matches) {
                setSpanWidth(75);
              } else {
                setSpanWidth(25);
              }
              setShowSetting(true);
            }}
          >
            <SettingsIcon />
          </IconButton>

          <IconButton aria-label="alarm">
            <NotificationsIcon />
          </IconButton>
        </div>
      </div>

      <SlidingPanel
        type={"right"}
        isOpen={showSetting}
        size={spanWidth}
        noBackdrop={false}
        backdropClicked={() => {
          setShowSetting(false);
        }}
      >
        <div className={styles.setting}>
          <ChatSetting
            close={() => {
              setShowSetting(false);
            }}
          />
        </div>
      </SlidingPanel>
    </>
  );
};

export default ChatListHeader;
