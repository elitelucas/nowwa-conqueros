import React, { useState, useEffect } from "react";
import styles from "../Wallet.module.sass";

const CoinInfoItem = (props) => {
  return (
    <div className={styles.walletcontainer__details__list__item}>
      <img
        src={props.data.src}
        alt="coin"
        className={styles.walletcontainer__details__list__item__img}
      />
      <div className={styles.walletcontainer__details__list__item__coininfo}>
        <p
          className={
            styles.walletcontainer__details__list__item__coininfo__label
          }
        >
          {props.data.name}
        </p>
        <p
          className={
            styles.walletcontainer__details__list__item__coininfo__percent
          }
        >
          {props.data.percent}
        </p>
      </div>
      <div className={styles.walletcontainer__details__list__item__priceinfo}>
        <p
          className={
            styles.walletcontainer__details__list__item__priceinfo__priceusd
          }
        >
          {props.data.priceUsd}
        </p>
        <p
          className={
            styles.walletcontainer__details__list__item__priceinfo__pricecoin
          }
        >
          {props.data.priceCoin}
        </p>
      </div>
    </div>
  );
};

export default CoinInfoItem;
