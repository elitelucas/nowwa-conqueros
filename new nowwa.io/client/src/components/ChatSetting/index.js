import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ImageIcon from "@mui/icons-material/Image";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { Switch } from "@mui/material";
import styles from "./ChatSetting.module.sass";
import { alpha, styled } from "@mui/material/styles";

const YellowSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#FDB334",
    "&:hover": {
      backgroundColor: alpha("#FDB334", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#FDB334",
  },
}));

const ChatSetting = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__title}>
        <CloseIcon
          className={styles.container__title__close}
          onClick={() => {
            props.close();
          }}
        ></CloseIcon>
        <div className={styles.container__title}>Chat Settings</div>
      </div>

      <div className={styles.container__avatar}>
        <img src="/images/content/avatar-1.jpg" alt="Avatar" />
        <div className={styles.container__avatar__name}>Leo</div>
        <div className={styles.container__avatar__state}>
          <div className={styles.container__avatar__state__icon}></div>
          <p>Active</p>
        </div>
        <div className={styles.container__avatar__date}>Since 2019</div>
      </div>

      <div className={styles.container__viewProfile}>
        <AccountCircleIcon className={styles.container__viewProfile__icon} />
        <span>View Profile</span>
      </div>

      <div className={styles.container__notification}>
        <div className={styles.container__notification__title}>
          <NotificationsNoneIcon
            className={styles.container__notification__icon}
          />
          <span>Notification</span>
        </div>
        <YellowSwitch defaultChecked />
      </div>

      <div className={styles.container__gallery}>
        <div className={styles.container__gallery__iconbox}>
          <ImageIcon
            className={styles.container__gallery__iconbox__icon}
            style={{ color: "#FBBA18" }}
          />
          <div className={styles.container__gallery__iconbox__title}>
            <span>Photos</span>
            <span>231</span>
          </div>
        </div>

        <div className={styles.container__gallery__button}>
          <ArrowForwardIosIcon />
        </div>
      </div>

      <div className={styles.container__gallery}>
        <div className={styles.container__gallery__iconbox}>
          <MovieFilterIcon
            className={styles.container__gallery__iconbox__icon}
            style={{ color: "#F97B11" }}
          />
          <div className={styles.container__gallery__iconbox__title}>
            <span>Videos</span>
            <span>67</span>
          </div>
        </div>

        <div className={styles.container__gallery__button}>
          <ArrowForwardIosIcon />
        </div>
      </div>

      <div className={styles.container__gallery}>
        <div className={styles.container__gallery__iconbox}>
          <AttachmentIcon
            className={styles.container__gallery__iconbox__icon}
            style={{ color: "#CC434C" }}
          />
          <div className={styles.container__gallery__iconbox__title}>
            <span>Other</span>
            <span>19</span>
          </div>
        </div>

        <div className={styles.container__gallery__button}>
          <ArrowForwardIosIcon />
        </div>
      </div>
    </div>
  );
};

export default ChatSetting;
