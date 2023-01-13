import React, { useState, useEffect, useContext } from "react";
import styles from "../Wallet.module.sass";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { ConquerContext } from "../../../contexts/ConquerContext";

const Activity = () => {
  //conquer
  const { history } = useContext(ConquerContext)

  return (

    <>
      {history.map((historyitem, index) => (
        <div className={styles.walletcontainer__details__list__item} key={index}>
          {historyitem.type === "send" ? (
            <NorthIcon
              className={styles.walletcontainer__details__list__item__icon}
            />
          ) : (
            <SouthIcon
              className={styles.walletcontainer__details__list__item__icon}
            />
          )}
          <div className={styles.walletcontainer__details__list__item__coininfo}>
            <p
              className={
                styles.walletcontainer__details__list__item__coininfo__label
              }
            >
              {historyitem.type === "send" ? "Send" : "Receive"}
            </p>
            <p
              className={
                styles.walletcontainer__details__list__item__coininfo__percent
              }
            >
              {new Date(new Date(historyitem.date).getTime()).toLocaleString()}
            </p>
          </div>
          <div className={styles.walletcontainer__details__list__item__priceinfo}>
            <p
              className={
                styles.walletcontainer__details__list__item__priceinfo__priceusd
              }
            >
              {/* {historyitem.valueUsd} */}
              $123
            </p>
            <p
              className={
                styles.walletcontainer__details__list__item__priceinfo__pricecoin
              }
            >
              {historyitem.amount} {historyitem.token}
            </p>
          </div>
        </div>
      ))}
    </>

  );
};

export default Activity;