import React, { useEffect } from "react";
import styles from "./Game.module.sass";
import Hero from "./Hero";
import Comments from "./Comments";

const Game = ({ children }) => {
  return (
    <div className={styles.container}>
      <Hero />
      <Comments />
    </div>
  );
};

export default Game;
