import React, { useState, useEffect } from "react";
import styles from "./Wallet.module.sass";
import cn from "classnames";
import Loader from "../../Loader";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect } from "../../../connectors";
import { ErrorMessages } from "../../../constants";

export default function WalletModal({ onClose }) {
  const { account, activate, deactivate, error } = useWeb3React();
  const [isConnecting, setIsConnecting] = useState(false);

  const onClickLogin = async () => {
    window.location.href = "/login";
  };
  const onclickConnect = async () => {
    setIsConnecting(true);

    try {
      await activate(injected);
      onClose();
    } catch (err) {
      console.error(err);
    }

    setIsConnecting(false);
  };

  const onclickWalletconnect = async () => {
    setIsConnecting(true);

    try {
      await activate(walletconnect);
    } catch (err) {
      console.error(err);
    }

    setIsConnecting(false);
  };

  const isMetamaskInstalled = () => {
    if (typeof window.ethereum !== "undefined") {
      return true;
    }

    return false;
  };

  return (
    <div className={styles.transfer}>
      <div className={cn("h4", styles.title)}>Authentication</div>
      <div
            onClick={onClickLogin}
            className={cn("button-stroke", styles.button, styles.wallet)}
          >
            <div>Log In</div>           
          </div>
      {!isMetamaskInstalled() ? (
        <div className={styles.text}>
          In case you don’t have, you will need to set up a{" "}
          <a
            className="text-blue-400"
            href="https://metamask.io"
            target={"_blank"}
          >
            Metamask
          </a>{" "}
          wallet.
        </div>
      ) : account ? (
        <div>
          <Link className={cn("button-stroke", styles.button)} to="/store">
            My Collections
          </Link>
        </div>
      ) : isConnecting ? (
        <div className={cn("button-stroke", styles.button, styles.wallet)}>
          <Loader />
          <div>Connecting...</div>
        </div>
      ) : (
        <div className={styles.btns}>
          
          <div
            onClick={onclickConnect}
            className={cn("button-stroke", styles.button, styles.wallet)}
          >
            <div>Metamask</div>
            <img src="/images/metamask.png" />
          </div>
          <div
            onClick={onclickWalletconnect}
            className={cn("button-stroke", styles.button, styles.wallet)}
          >
            <div>Wallet Connect</div>
            <img src="/images/walletConnectIcon.svg" />
          </div>
        </div>
      )}

      {/* { error ? (
            <div className={styles.text, styles.footer}> 
                { ErrorMessages[ error.code ] ? ErrorMessages[ error.code ] : error.message }
            </div>
        ) : null } */}
    </div>
  );
}
