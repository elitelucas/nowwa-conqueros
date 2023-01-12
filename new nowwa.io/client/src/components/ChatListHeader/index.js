import React, { useState } from "react";
import { IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatSetting from "../ChatSetting";
import styles from "./ChatListHeader.module.sass";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";

const ChatListHeader = (props) => {
  const [showSetting, setShowSetting] = useState(false);
  const [spanWidth, setSpanWidth] = useState(25);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__left}>
          <div className={styles.container__left__avatar}>
            <img src="/images/content/avatar-0.jpg" alt="Avatar" />
          </div>
          <div className={styles.container__left__info}>
            <span className={styles.container__left__info__name}>
              {props.selectedUser}
            </span>
            <div className={styles.container__left__info__state}>
              <div
                className={styles.container__left__info__state__iconActive}
              />
              <div
                className={styles.container__left__info__state__stringActive}
              >
                Active
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.topGradient} /> */}

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
