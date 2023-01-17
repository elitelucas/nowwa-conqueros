import React, { useEffect } from "react";
import styles from "./my.module.sass";
import cn from "classnames";

const Hero = ({ children }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.textbox}>
        <p className={styles.subtitle}> FEATURED</p>
        <h1 className={styles.title}>
          Ultimate gamers Fortnite all around review
        </h1>
        <p className={styles.text}>
          Become one of the contributors in our Fortnite community
        </p>
        <button className={styles.playbutton}>PLAY NOW</button>
      </div>
    </div>
  );
};

export default Hero;
