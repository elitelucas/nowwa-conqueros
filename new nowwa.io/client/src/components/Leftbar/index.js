import React, { useState } from "react";
import styles from "./Leftbar.module.sass";
import cn from "classnames";
import Icon from "../Icon";
import { Link, NavLink } from "react-router-dom";
import Image from "../Image";
import { withRouter, useLocation } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChatIcon from "@mui/icons-material/Chat";

const Leftbar = ({ children }) => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.container}>
      <Link className={styles.logo} to="/">
        <Image
          className={styles.pic}
          src="/images/logo-icon.png"
          srcDark="/images/logo-icon.png"
          alt="Nowwa"
          width="80%"
        />
      </Link>
      <div
        className={cn(
          styles.appicon,
          (pathname == "/" || pathname == "/Mint") && styles.active
        )}
      >
        <DashboardOutlinedIcon sx={{ fontSize: 40 }} />
      </div>

      <div className={styles.tools}>
        <Link to="/">
          <button
            className={cn(styles.menuitem, pathname == "/" && styles.active)}
          >
            <LocalFireDepartmentOutlinedIcon />
          </button>
        </Link>
        <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
          <Link to="/mint">
            <button
              className={cn(
                styles.menuitem,
                styles.mint,
                pathname == "/mint" && styles.active
              )}
              onClick={() => setVisible(!visible)}
            >
              <Groups2OutlinedIcon />
              {visible && (
                <div className={styles.body}>
                  <div className={styles.item}>
                    <Link to="/mint">Mint</Link>
                  </div>
                  <div className={styles.item}>
                    <Link to="/gallery">Gallery</Link>
                  </div>
                </div>
              )}
            </button>
          </Link>
        </OutsideClickHandler>

        <Link to="/pagelist">
          <button
            className={cn(
              styles.menuitem,
              pathname == "/pagelist" && styles.active
            )}
          >
            <BookmarkBorderOutlinedIcon />
          </button>
        </Link>
        <Link to="/item">
          <button
            className={cn(
              styles.menuitem,
              pathname == "/item" && styles.active
            )}
          >
            <StarBorderOutlinedIcon />
          </button>
        </Link>
      </div>
      <div className={styles.bar}>
        <Link to="/game">
          <button
            className={cn(
              styles.menuitem,
              pathname == "/game" && styles.active
            )}
          >
            <TrendingUpOutlinedIcon />
          </button>
        </Link>

        {/* <Link to="/faq">
          <button
            className={cn(styles.menuitem, pathname == "/faq" && styles.active)}
          >
            <QuestionAnswerOutlinedIcon />
          </button>
        </Link> */}

        <Link to="/chat">
          <button
            className={cn(
              styles.menuitem,
              pathname == "/chat" && styles.active
            )}
          >
            <ChatIcon />
          </button>
        </Link>

        <Link to="/profile">
          <button
            className={cn(
              styles.menuitem,
              pathname == "/profile" && styles.active
            )}
          >
            <PersonOutlineOutlinedIcon />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Leftbar;
