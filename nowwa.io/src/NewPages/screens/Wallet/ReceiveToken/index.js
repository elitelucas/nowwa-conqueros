import React, { useState, useEffect } from "react";
import styles from "./ReceiveToken.module.sass";
import NowwaSelect from "../NowwaSelect";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import LinkIcon from "@mui/icons-material/Link";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import QRCode from "react-qr-code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import cn from "classnames";

const coinInfo = [
  {
    sd_src: "/images/coins/btc.png",
    value: "Bitcoin",
    priceUsd: "$306.46",
    priceCoin: "0.0159277 BTC",
  },
  {
    sd_src: "/images/coins/eth.png",
    value: "Ethereum",
    percent: "+3.56%",
    priceUsd: "$1306.60",
    priceCoin: "1 ETH",
  },
  {
    sd_src: "/images/coins/bnb.png",
    value: "Bnb",
    percent: "-4.06%",
    priceUsd: "$56.46",
    priceCoin: "0.16 BNB",
  },
];

const Step0 = (props) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [amount, setAmount] = useState(0.0);
  return (
    <div className={styles.step}>
      <div className={styles.step__title}>
        <p>Receive</p>
      </div>

      <QRCode
        size={220}
        value={
          "https://nowwaio.com/send/0xBBB6A12945AC14C9432A15C56D2EAE94/value=21lp"
        }
        viewBox={`0 0 220 220`}
        bgColor="#11141B"
        fgColor="#ffffff"
      />

      <p className={styles.step__subdesc}>Scan address to receive payment</p>

      <div className={styles.step__subbtnbox}>
        <div
          className={styles.step__subbtn}
          onClick={() => {
            navigator.clipboard.writeText("0x3Dc6A12945AC14C9432A15C56DDfCE");
            setOpenSnackbar(true);
            setTimeout(() => {
              setOpenSnackbar(false);
            }, 3000);
          }}
        >
          <p style={{ "margin-right": "10px" }}>0x3Dc6..DfCE</p>
          <ContentCopyIcon className={styles.step__subbtn__img} />
        </div>

        <div className={styles.step__subbtn}>
          <ShareIcon className={styles.step__subbtn__img} />
        </div>
      </div>

      <button
        className={cn("button-yellow", styles.btn)}
        onClick={() => {
          props.onNextStep();
        }}
        style={{ marginTop: "50px" }}
      >
        Request Payment
      </button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        open={openSnackbar}
      >
        <div className={styles.step__subbtn}>
          <p style={{ "margin-right": "10px" }}>Link copied to clipboard!</p>
          <ContentCopyIcon className={styles.step__subbtn__img} />
        </div>
      </Snackbar>
    </div>
  );
};

const Step1 = (props) => {
  const [amount, setAmount] = useState(0.0);
  return (
    <div className={styles.step}>
      <div className={styles.step__title}>
        <p>Amount</p>
        <ArrowBackIosNewIcon
          className={styles.step__title__prev}
          onClick={() => {}}
        ></ArrowBackIosNewIcon>
      </div>

      <div className={styles.step__tokenSelect}>
        <NowwaSelect startDecorator={true} data={coinInfo} type="outlined" />
      </div>

      <input
        type="text"
        className={styles.step_amountInput}
        defaultValue="5.25"
      ></input>

      <div className={styles.step__usdValue}>
        <p>$55.99312</p>
        <SwapVertIcon />
      </div>

      <button
        className={cn("button-yellow", styles.btn)}
        onClick={() => {
          props.onNextStep();
        }}
        style={{ marginTop: "100px" }}
      >
        Next
      </button>
    </div>
  );
};

const Step2 = (props) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  return (
    <div className={styles.step}>
      <LinkIcon className={styles.step__linkImg} />
      <p className={styles.step__linkLabel}>Send Link</p>
      <p className={styles.step__linkDescription}>
        Your request link is already to send!
      </p>
      <p className={styles.step__linkDescription}>
        Send this link to a friend and it will ask them to send 0.0001ETH
      </p>

      <p className={styles.step__link}>
        https://nowwaio.com/send/0xBBB6A12945AC14C9432A15C56D2EAE94/value=21lp
      </p>

      <div className={styles.row}>
        <p
          className={styles.step__linkCopy}
          onClick={() => {
            navigator.clipboard.writeText("0x3Dc6A12945AC14C9432A15C56DDfCE");
            setOpenSnackbar(true);
            setTimeout(() => {
              setOpenSnackbar(false);
            }, 3000);
          }}
        >
          Copy Link
        </p>
        <p
          className={styles.step__linkCopy}
          onClick={() => {
            setOpenQR(true);
          }}
        >
          QR code
        </p>
      </div>

      <button
        className={cn("button-yellow", styles.btn)}
        style={{ marginTop: "50px" }}
      >
        Next
      </button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        open={openSnackbar}
      >
        <div className={styles.step__subbtn}>
          <p style={{ "margin-right": "10px" }}>Link copied to clipboard!</p>
          <ContentCopyIcon className={styles.step__subbtn__img} />
        </div>
      </Snackbar>
      <Modal
        open={openQR}
        onClose={() => {
          setOpenQR(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modal}>
          <div className={styles.modal__title}>
            <p>Payment request QR Code</p>
          </div>
          <QRCode
            size={220}
            value={
              "https://nowwaio.com/send/0xBBB6A12945AC14C9432A15C56D2EAE94/value=21lp"
            }
            viewBox={`0 0 220 220`}
            bgColor="#23262F"
            fgColor="#ffffff"
          />
        </div>
      </Modal>
    </div>
  );
};

const WalletReceiveToken = (props) => {
  const [step, setStep] = useState(1);
  return (
    <div className={styles.wallet}>
      {step === 1 && (
        <Step1
          onNextStep={() => {
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2
          onPrevStep={() => {
            setStep(1);
          }}
        />
      )}
    </div>
  );
};

export default WalletReceiveToken;
