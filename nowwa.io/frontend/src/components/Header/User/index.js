import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./User.module.sass";
import Icon from "../../Icon";
import Theme from "../../Theme";
import Wallet from "../Wallet";
import Modal from "../../Modal";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress, getNameFromEmail } from "../../../helper";
import ls from "local-storage";
import { ConquerContext } from "../../../contexts/ConquerContext";

const items = [
  {
    title: "My profile",
    icon: "user",
    url: "/profile",
  },
  {
    title: "My items",
    icon: "image",
    url: "/store",
  },
  {
    title: "Dark theme",
    icon: "bulb",
  },
  {
    title: "Disconnect",
    icon: "exit",
    url: "https://ui8.net/ui8/products/crypter-nft-marketplace-ui-kit",
  },
];

const User = ({ className }) => {
  //conquer
  const { username, loggedin, logout, balance: ETHbalance } = useContext(ConquerContext)

  //
  const onClickLogOut = async () => {
    logout();
  };

  const [visible, setVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const location = useLocation();

  const { account, deactivate, library } = useWeb3React();

  const [showDropDown, setShowDropDown] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // const toggleWalletModal = useWalletModalToggle()
  const toggleWalletModal = () => {
    setWalletModalOpen(!walletModalOpen);
  };

  const handleClickDropDownMenu = () => {
    setShowDropDown((prev) => !prev);
  };

  const detectTarget = (event) => {
    if (!event.target.matches("#dropdownMenuBtn")) {
      setShowDropDown(false);
    }
  };

  const onDisconnect = () => {
    deactivate();
    setVisible(!visible);
  };

  useEffect(() => {
    window.addEventListener("click", detectTarget);

    return () => {
      window.removeEventListener("click", detectTarget);
    };
  });

  useEffect(() => {
    async function get() {
      if (library) {
        await library
          ?.getBalance(account)
          .then((result) => setBalance(result / 1e18));
      }
    }

    get();
  });

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className)}>
        {/* <div className={styles.head} onClick={() => setVisible(!visible)}>
          <div className={styles.avatar}>
            <img src="/images/content/avatar-user.jpg" alt="Avatar" />
          </div>         
        </div> */}
        {loggedin ? (
          <button
            className={cn(
              "button-stroke",
              styles.button,
              styles.head,
              styles.connect
            )}
            onClick={() => setVisible(!visible)}
          >
            {getNameFromEmail(username)}
          </button>
        ) : account ? (
          <button
            className={cn(
              "button-stroke",
              styles.button,
              styles.head,
              styles.connect
            )}
            onClick={() => setVisible(!visible)}
          >
            {/* <div className={styles.avatar}>
              <img src="/images/content/avatar-user.jpg" alt="Avatar" />
            </div>
            <div className={styles.wallet}>
              7.00698 <span className={styles.currency}>ETH</span>
            </div> */}
            {shortenAddress(account)}
          </button>
        ) : (
          <button
            className={cn(
              "button-stroke",
              styles.button,
              styles.head,
              styles.connect
            )}
            onClick={() => toggleWalletModal()}
          >
            Login
          </button>
        )}
        {visible && (
          <div className={styles.body}>
            <div className={styles.name}>{username}</div>
            {account &&
              (
                <div className={styles.code}>
                  <div className={styles.number}>
                    {account && shortenAddress(account)}
                  </div>
                  <button className={styles.copy}>
                    <Icon name="copy" size="16" />
                  </button>
                </div>
              )}

            <div className={styles.wrap}>
              <div className={styles.line}>
                <div className={styles.preview}>
                  <img
                    src="/images/content/etherium-circle.jpg"
                    alt="Etherium"
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.info}>Balance</div>
                  <div className={styles.price}>
                    {/* {balance.toFixed(3) / 1} ETH */}
                    {ETHbalance?.toFixed(3) / 1} ETH
                  </div>
                </div>
              </div>
              <Link to="/wallet">
                <button
                  className={cn("button-stroke button-small", styles.button)}
                  onClick={() => setVisible(false)}
                >
                  My wallet
                </button>
              </Link>
            </div>
            <div className={styles.menu}>
              <Link className={styles.item} to="/store">
                <div className={styles.icon}>
                  <Icon name="image" size="20" />
                </div>
                <div className={styles.text}>My Collection</div>
              </Link>
              {/* <a className={styles.item}>
                <div className={styles.icon}>
                  <Icon name="bulb" size="20" />
                </div>
                <div className={styles.text}>Dark theme</div>
                <Theme className={styles.theme} />
              </a> */}
              <a
                className={cn(styles.item, styles.disconnect)}
                onClick={onDisconnect}
              >
                <div className={styles.icon}>
                  <Icon name="exit" size="20" />
                </div>
                <div className={styles.text} onClick={onClickLogOut}>
                  Log Out
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
      <Modal visible={walletModalOpen} onClose={toggleWalletModal}>
        <Wallet onClose={toggleWalletModal} />
      </Modal>
    </OutsideClickHandler>
  );
};

export default User;
