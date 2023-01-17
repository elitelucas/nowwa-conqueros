import React from "react";
import { IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import styles from "./GroupChatListHeader.module.sass";

const GroupChatListHeader = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__left}>
          <div className={styles.container__left__avatar}>
            <img src="/images/content/avatar-1.jpg" alt="Avatar" />
          </div>
          <div className={styles.container__left__info}>
            <span className={styles.container__left__info__name}>Group</span>
            <div className={styles.container__left__info__state}>
              <div className={styles.container__left__info__state__icon}>
                <img src="/images/content/avatar-1.jpg" alt="Avatar" />
                <img src="/images/content/avatar-2.jpg" alt="Avatar" />
                <img src="/images/content/avatar-3.jpg" alt="Avatar" />
                <img src="/images/content/avatar-4.jpg" alt="Avatar" />
              </div>
              <div
                className={styles.container__left__info__state__stringActive}
              >
                +56 Members
              </div>
            </div>
          </div>
        </div>
        <div className={styles.topGradient} />

        <div className={styles.container__right}>
          <IconButton aria-label="loadmore">
            <MoreHorizIcon />
          </IconButton>

          <IconButton aria-label="setting">
            <SettingsIcon />
          </IconButton>

          <IconButton aria-label="alarm">
            <NotificationsIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default GroupChatListHeader;
