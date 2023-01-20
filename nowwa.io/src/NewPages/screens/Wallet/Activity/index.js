import React, { useState, useEffect, useContext } from "react";
import styles from "../Wallet.module.sass";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { Box, CircularProgress } from "@mui/material";
import { WalletContext } from "../../../contexts/WalletContext";
import { shortenAddress } from "../../../helper";
import date from 'date-and-time';

const Activity = () => {
  //conquer
  const { history,  loadingActivity } = useContext(WalletContext)

  return (

    <>
      {loadingActivity ?
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </Box>
        :
        history.map((historyitem, index) => (
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
                {date.format(new Date(historyitem.timestamp), 'MM/DD/YYYY HH:mm A')}
              </p>
            </div>
            <div className={styles.walletcontainer__details__list__item__priceinfo}>
              <p
                className={
                  styles.walletcontainer__details__list__item__priceinfo__priceusd
                }
              >
                {historyitem.type === "send" ?
                  <>
                    <span>To: </span>
                    {shortenAddress(historyitem.recipientAddress)}
                  </> :
                  <>
                    <span>From: </span>
                    {shortenAddress(historyitem.senderAddress)}
                  </>
                }
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
        ))
      }
    </>

  );
};

export default Activity;
