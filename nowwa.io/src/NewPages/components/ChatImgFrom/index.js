import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./ChatImgFrom.module.sass";

const ChatImgFrom = () => {
  return (
    <div className={styles.column}>
      <div className={styles.container}>
        <div className={styles.container__avatar}>
          <img src="/images/content/avatar-1.jpg" alt="Avatar" />
        </div>
        <div className={styles.container__images}>
          <img src="/images/games/game2.png" alt="Avatar" />
        </div>
        <div className={styles.container__time}>09:30</div>
      </div>
      <div className={styles.react}>
        <img src="/images/content/react.png" alt="Avatar" />
        <span>29</span>
      </div>
    </div>
  );
};

export default ChatImgFrom;
