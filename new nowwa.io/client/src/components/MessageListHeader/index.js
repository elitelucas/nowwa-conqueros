import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import styles from "./MessageHeader.module.sass";
import Icon from "../Icon";

const MessageListHeader = () => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__title_row}>
          <div>
            <span className={styles.header__title}>Messages</span>
            <span className={styles.header__title_number}>12</span>
          </div>

          <div className={styles.header__title_new}>
            <OpenInNewIcon />
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
          />
        </div>
      </div>
    </>
  );
};

export default MessageListHeader;
