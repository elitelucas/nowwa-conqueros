import React, { useEffect } from "react";
import styles from "./my.module.sass";
import cn from "classnames";
import { Link, NavLink } from "react-router-dom";
import Image from "../../components/Image";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Icon from "../../components/Icon";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const NAccount = ({ children }) => {
  return (
    <div className={styles.container}>
      <Grid container spacing={2}>
        {/* 1st row - 1 */}
        <Grid item xs={12} md={8}>
          <div className={styles.section_picture}>
            <img src="/images/content/avatar-1.jpg" alt="Avatar" />
            <Grid container spacing={0} className={styles.namebox}>
              <Grid item xs={10} style={{ paddingTop: "0px" }}>
                <p className={styles.name}>Daniel Doe</p>
                <p className={styles.username}>@DANIELDOE993</p>
                <p className={styles.text_small}>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonum
                </p>
              </Grid>
              <Grid item xs={2}>
                <Button variant="outlined" className={styles.iconbox}>
                  <MoreHorizIcon />
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>
        {/* 1st row - 2 */}
        <Grid item xs={12} md={4}>
          <div className={cn(styles.section_friends, styles.gray_box)}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <h3>Friends</h3>
                <p className={cn(styles.text_small)}>56 Friends on GameBop</p>
              </Grid>
              <Grid item xs={3}>
                <Button variant="outlined" className={styles.iconbox}>
                  <KeyboardArrowRightIcon />
                </Button>
              </Grid>
            </Grid>
            <div className={styles.avatar_group}>
              <div className={styles.avatar}>
                <img src="/images/content/avatar-1.jpg" alt="Avatar" />
              </div>
              <div className={styles.avatar}>
                <img src="/images/content/avatar-2.jpg" alt="Avatar" />
              </div>
              <div className={styles.avatar}>
                <img src="/images/content/avatar-3.jpg" alt="Avatar" />
              </div>
              <div className={styles.avatar}>
                <img src="/images/content/avatar-4.jpg" alt="Avatar" />
              </div>
              <AddIcon className={styles.addicon} fontSize="medium" />
            </div>
          </div>
        </Grid>
        {/* 2nd row - 1 */}
        <Grid item xs={12} md={8}>
          <div className={cn(styles.gray_box, styles.accordion)}>
            {/* item */}
            <Grid container spacing={2} className={cn(styles.accordion_item)}>
              <Grid item xs={1} style={{ textAlign: "right" }}>
                <PersonOutlineOutlinedIcon />
              </Grid>
              <Grid item xs={10}>
                Account
              </Grid>
              <Grid item xs={1}>
                <KeyboardArrowRightIcon />
              </Grid>
            </Grid>
            {/* item */}
            <Grid container spacing={2} className={cn(styles.accordion_item)}>
              <Grid item xs={1} style={{ textAlign: "right" }}>
                <NotificationsNoneOutlinedIcon />
              </Grid>
              <Grid item xs={10}>
                Notifications
              </Grid>
              <Grid item xs={1}>
                <KeyboardArrowRightIcon />
              </Grid>
            </Grid>
            {/* item */}
            <Grid container spacing={2} className={cn(styles.accordion_item)}>
              <Grid item xs={1} style={{ textAlign: "right" }}>
                <RemoveRedEyeOutlinedIcon />
              </Grid>
              <Grid item xs={10}>
                Appearance
              </Grid>
              <Grid item xs={1}>
                <KeyboardArrowRightIcon />
              </Grid>
            </Grid>
            {/* item */}
            <Grid container spacing={2} className={cn(styles.accordion_item)}>
              <Grid item xs={1} style={{ textAlign: "right" }}>
                <LockOutlinedIcon />
              </Grid>
              <Grid item xs={10}>
                Privacy & Security
              </Grid>
              <Grid item xs={1}>
                <KeyboardArrowRightIcon />
              </Grid>
            </Grid>
            {/* item */}
            <Grid container spacing={2} className={cn(styles.accordion_item)}>
              <Grid item xs={1} style={{ textAlign: "right" }}>
                <HeadsetMicOutlinedIcon />
              </Grid>
              <Grid item xs={10}>
                Help & Support
              </Grid>
              <Grid item xs={1}>
                <KeyboardArrowRightIcon />
              </Grid>
            </Grid>
            {/* item */}
            <Grid container spacing={2} className={cn(styles.accordion_item)}>
              <Grid item xs={1} style={{ textAlign: "right" }}>
                <InfoOutlinedIcon />
              </Grid>
              <Grid item xs={10}>
                About
              </Grid>
              <Grid item xs={1}>
                <KeyboardArrowRightIcon />
              </Grid>
            </Grid>
          </div>
        </Grid>
        {/* 2nd row - 2 */}
        <Grid item xs={12} md={4}>
          <div className={cn(styles.gray_box)}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <h3>Recent Activity</h3>
                <p className={cn(styles.text_small)}>
                  See your recent activity on GameBop
                </p>
              </Grid>
              <Grid item xs={3}>
                <Button variant="outlined" className={styles.iconbox}>
                  <KeyboardArrowRightIcon />
                </Button>
              </Grid>
            </Grid>

            <div className={cn(styles.activities)}>
              {[1, 2, 3].map((item, index) => (
                <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                  <Grid item xs={2} style={{ textAlign: "right" }}>
                    <img src="/images/content/avatar-1.jpg" alt="Avatar" />
                  </Grid>
                  <Grid item xs={7}>
                    <p>Your commented PUBG Crew's post</p>
                    <p className={cn(styles.text_mute)}>
                      Lorem ipsum dolor sit amet, cons...
                    </p>
                  </Grid>
                  <Grid item xs={3}>
                    <span className={cn(styles.text_mute)}>4h ago</span>
                  </Grid>
                </Grid>
              ))}
            </div>
          </div>
        </Grid>
      </Grid>

      {/* GAMES */}
      <div className={cn(styles.game_header)}>
        <h3>GAMES YOU PLAY</h3>
      </div>
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
          <Grid item xs={6} sm={4} md={3}>
            <div className={cn(styles.game)}>
              <img src={`/images/games/game${index + 1}.png`} alt="Avatar" />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default NAccount;
