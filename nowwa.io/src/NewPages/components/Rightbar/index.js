import React, { useEffect } from "react";
import * as styles from "./Rightbar.module.sass";
import cn from "classnames";
import Icon from "../Icon";
import { Link, NavLink } from "react-router-dom";
import Image from "../Image";
import User from "../Header/User";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const Rightbar = ({ children }) => {
  return (
    <div>
      <User className={styles.user} />
      <div className={styles.container}>
        <div className={styles.bar}>
          <div className={styles.avatar}>
            <img src="/images/content/avatar-1.jpg" alt="Avatar" />
          </div>
          <div className={styles.avatar}>
            <img src="/images/content/avatar-2.jpg" alt="Avatar" />
            <div className={styles.active}></div>
          </div>
          <div className={styles.avatar}>
            <img src="/images/content/avatar-3.jpg" alt="Avatar" />
          </div>
          <div className={styles.avatar}>
            <img src="/images/content/avatar-4.jpg" alt="Avatar" />
            <div className={styles.active}></div>
          </div>
        </div>

        <AddOutlinedIcon sx={{ fontSize: "30px", marginTop: "20px" }} />
      </div>
    </div>
  );
};

export default Rightbar;
