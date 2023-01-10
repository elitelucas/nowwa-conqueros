import React, { useState, useEffect, useContext } from "react";
import styles from "./Wallet.module.sass";
import cn from "classnames";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SellIcon from "@mui/icons-material/Sell";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import CoinInfo from "./CoinInfo";
import Modal from "@mui/material/Modal";
import Tokens from "./Token";
import ReceiveModal from "./ReceiveToken/receiveModal";
import { ConquerContext } from "../../contexts/ConquerContext";

const Wallet = ({ }) => {
  //conquer
  const { balance } = useContext(ConquerContext)

  const [open, setOpen] = useState(false);
  const [isAddToken, setIsAddToken] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);

  const gotoLink = (link) => {
    window.location.href = link;
  };

  return (
    <div className={styles.wallet}>
      <div className={styles.walletcontainer}>
        <div className={styles.walletcontainer__walletname}>Primary wallet</div>

        <div className={styles.walletcontainer__balance}>
          <div className={styles.walletcontainer__balance__label}>
            <p>Your balance</p>
          </div>
          <div className={styles.walletcontainer__balance__value}>
            {/* <p>$30621.46</p> */}
            <p>{balance}ETH</p>
          </div>
        </div>

        <div className={styles.walletcontainer__actionbar}>
          <div
            className={styles.walletcontainer__actionbar__actionitem}
            onClick={() => {
              setReceiveModalOpen(true);
            }}
          >
            <SouthIcon
              className={styles.walletcontainer__actionbar__actionitem__icon}
            />
            <p>Receive</p>
          </div>
          <div
            className={styles.walletcontainer__actionbar__actionitem}
            onClick={() => {
              gotoLink("/wallet/send");
            }}
          >
            <NorthIcon
              className={styles.walletcontainer__actionbar__actionitem__icon}
            />
            <p>Send</p>
          </div>
          <div
            className={styles.walletcontainer__actionbar__actionitem}
            onClick={() => {
              setOpen(true);
            }}
          >
            <MoreHorizIcon
              className={styles.walletcontainer__actionbar__actionitem__icon}
            />
            <p>More</p>
          </div>
        </div>

        <CoinInfo />

        <button
          className={cn("button-stroke", styles.walletcontainer__btn)}
          onClick={() => {
            setIsAddToken(true);
          }}
        >
          Add Tokens
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modal}>
          <div className={styles.modal__title}>
            <p>More Actions</p>
          </div>
          <div className={styles.modal__actiongrid}>
            <div className={styles.modal__actiongrid__item}>
              <CreditCardIcon
                className={styles.modal__actiongrid__item__icon}
              />
              <p>Buy</p>
            </div>
            <div className={styles.modal__actiongrid__item}>
              <SellIcon className={styles.modal__actiongrid__item__icon} />
              <p>Sell</p>
            </div>
            <div
              className={styles.modal__actiongrid__item}
              onClick={() => {
                setReceiveModalOpen(true);
              }}
            >
              <SouthIcon className={styles.modal__actiongrid__item__icon} />
              <p>Receive</p>
            </div>
            <div
              className={styles.modal__actiongrid__item}
              onClick={() => {
                gotoLink("/wallet/send");
              }}
            >
              <NorthIcon className={styles.modal__actiongrid__item__icon} />
              <p>Send</p>
            </div>
            {/* <div className={styles.modal__actiongrid__item}>
              <CurrencyExchangeIcon
                className={styles.modal__actiongrid__item__icon}
              />
              <p>Cash out</p>
            </div> */}
            <div className={styles.modal__actiongrid__item}>
              <SwapHorizIcon className={styles.modal__actiongrid__item__icon} />
              <p>Trade</p>
            </div>
            <div
              className={styles.modal__actiongrid__item}
              onClick={() => gotoLink("/wallet/backup")}
            >
              <SettingsBackupRestoreIcon
                className={styles.modal__actiongrid__item__icon}
              />
              <p>Back up</p>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isAddToken}
        onClose={() => {
          setIsAddToken(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.tokenmodal}>
          <Tokens
            onClose={() => {
              setIsAddToken(false);
            }}
          />
        </div>
      </Modal>
      <Modal
        open={receiveModalOpen}
        onClose={() => {
          setReceiveModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.receivemodal}>
          <ReceiveModal onNextStep={() => gotoLink("/wallet/receive")} />
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;
