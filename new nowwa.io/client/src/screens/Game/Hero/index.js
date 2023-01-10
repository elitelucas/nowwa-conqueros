import React, { useEffect, useState } from "react";
import styles from "./my.module.sass";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ShareIcon from "@mui/icons-material/Share";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <div className={styles.container}>
            <div className={styles.container__hero}>
              <div className={styles.textbox}>
                <p className={styles.subtitle}>TRENDING</p>
                <h1 className={styles.title}>Clash of Clans</h1>
                <p className={styles.text}>
                  Experience the world of titans now
                </p>
                <p className={styles.text}>
                  Start Playing and join your friends
                </p>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.row__player}>
                <img src="/images/content/avatar-1.jpg" alt="Avatar" />
                <img src="/images/content/avatar-2.jpg" alt="Avatar" />
                <img src="/images/content/avatar-3.jpg" alt="Avatar" />
                <img src="/images/content/avatar-4.jpg" alt="Avatar" />
              </div>
              <p className={styles.row__player__comment}>20+ Friend Played</p>
            </div>
            <div className={styles.column}>
              <div className={styles.row__rating}>
                <StarIcon className={styles.rating__fill} />
                <StarIcon className={styles.rating__fill} />
                <StarIcon className={styles.rating__fill} />
                <StarOutlineIcon className={styles.rating__outline} />
                <StarOutlineIcon className={styles.rating__outline} />
              </div>
              <p className={styles.row__rating__text}>
                15K People Played Worldwide
              </p>
            </div>
          </div>

          <div className={styles.row}>
            <button className={styles.playbutton}>PLAY NOW</button>
            <div className={styles.addbutton}>
              <GroupAddIcon />
              <p>Add a Friend</p>
            </div>
            <div className={styles.sharebutton}>
              <ShareIcon />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.hero}>
          <div className={styles.textbox}>
            <p className={styles.subtitle}>TRENDING</p>
            <h1 className={styles.title}>Clash of Clans</h1>
            <p className={styles.text}>Experience the world of titans now</p>
            <p className={styles.text}>Start Playing and join your friends</p>
            <div className={styles.player}>
              <img src="/images/content/avatar-1.jpg" alt="Avatar" />
              <img src="/images/content/avatar-2.jpg" alt="Avatar" />
              <img src="/images/content/avatar-3.jpg" alt="Avatar" />
              <img src="/images/content/avatar-4.jpg" alt="Avatar" />
              <p className={styles.player__comment}>20+ Friend Played</p>
            </div>
            <div className={styles.rating}>
              <StarIcon className={styles.rating__fill} />
              <StarIcon className={styles.rating__fill} />
              <StarIcon className={styles.rating__fill} />
              <StarOutlineIcon className={styles.rating__outline} />
              <StarOutlineIcon className={styles.rating__outline} />
            </div>
            <p className={styles.text}>15K People Played Worldwide</p>

            <div className={styles.buttonbox}>
              <button className={styles.playbutton}>PLAY NOW</button>
              <div className={styles.addbutton}>
                <GroupAddIcon />
                <p>Add a Friend</p>
              </div>
              <div className={styles.sharebutton}>
                <ShareIcon />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
