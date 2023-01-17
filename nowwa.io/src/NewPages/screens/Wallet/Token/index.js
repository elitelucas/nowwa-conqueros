import React, { useState, useEffect } from "react";
import styles from "./token.module.sass";
import Icon from "../../../components/Icon";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const tokenInfos = [
  { name: "ADA", src: "/images/coins/ada.png", state: false },
  { name: "BNB", src: "/images/coins/bnb.png", state: true },
  { name: "Bitcoin", src: "/images/coins/btc.png", state: true },
  { name: "Chainlink", src: "/images/coins/chainlink.png", state: false },
  { name: "Ethereum", src: "/images/coins/eth.png", state: true },
  { name: "Shiba", src: "/images/coins/shiba.png", state: false },
  { name: "Terra", src: "/images/coins/terra.png", state: false },
  { name: "Tron", src: "/images/coins/tron.png", state: false },
  { name: "TUSD", src: "/images/coins/tusd.png", state: false },
  { name: "USDC", src: "/images/coins/usdc.png", state: false },
  { name: "USDT", src: "/images/coins/usdt.png", state: false },
];

const TokenItem = (props) => {
  return (
    <div className={styles.tokens__list__item}>
      <img
        className={styles.tokens__list__item__img}
        alt="coinname"
        src={props.data.src}
      />
      <p className={styles.tokens__list__item__name}>{props.data.name}</p>
      <div className={styles.tokens__list__item__switch}>
        <label className={styles.theme}>
          <input
            className={styles.input}
            type="checkbox"
            defaultChecked={props.data.state}
          />
          <span className={styles.inner}>
            <span className={styles.box}></span>
          </span>
        </label>
      </div>
    </div>
  );
};

const Tokens = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.tokens}>
        <div className={styles.header__title}>
          <p>Add Token</p>
          <ArrowBackIosNewIcon
            className={styles.header__title__prev}
            onClick={() => {
              props.onClose();
            }}
          />
        </div>

        <div className={styles.header__search}>
          <Icon className="searchicon" name="search" size="28" />
          <input
            className={styles.header__input}
            type="text"
            name="search"
            placeholder="Search"
            required
          />
        </div>
        <p className={styles.header__description}>
          Easily decide which coins you'd like to display in the hompage
        </p>
        <div className={styles.tokens__list}>
          {tokenInfos.map((token, index) => {
            return <TokenItem data={token} index={index}></TokenItem>;
          })}
        </div>
      </div>
    </div>
  );
};

export default Tokens;
