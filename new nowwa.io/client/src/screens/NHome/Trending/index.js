import React, { useState, useEffect } from "react";
import styles from "./my.module.sass";
import cn from "classnames";
// remove
import { bids } from "../../../mocks/bids";
import Items from "../../Profile/Items";

const navLinks = [
  "Top Played",
  "Currently Online",
  "Verified"
];

const Trending = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.container}>
      <p className={styles.subtitle}>TRENDING</p>
      <div className={styles.heading_wrapper}>
        <h1 className={styles.heading}>Gamebop's Choice</h1>
        <span> View All</span>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          {navLinks.map((x, index) => (
            <button
              className={cn(styles.link, {
                [styles.active]: index === activeIndex,
              })}
              key={index}
              onClick={() => setActiveIndex(index)}
            >
              {x}
            </button>
          ))}
        </div>
        <div className={styles.group}>
          <div className={styles.item}>
            {activeIndex === 0 && (
              <Items class={styles.items} items={bids.slice(0, 3)} />
            )}
            {activeIndex === 1 && (
              <Items class={styles.items} items={bids.slice(0, 2)} />
            )}
            {activeIndex === 2 && (
              <Items class={styles.items} items={bids.slice(0, 1)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
