import React, { useState, useEffect, useContext } from "react";
import styles from "./SendToken.module.sass";
import NowwaSelect from "../NowwaSelect";
import TextField from "@mui/joy/TextField";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import cn from "classnames";
import { WalletContext } from "../../../contexts/WalletContext";
import DECIMALS from "../../../../UTIL/DECIMALS";
import { WITHDRAW_FEES } from "../../../../Core/CONFIG/WALLET";

const Step1 = (props) => {
  const fromAddress = [
    {
      sd_src: "/images/content/avatar-1.jpg",
      value: props.fromAddress,
    },
    {
      sd_src: "/images/content/avatar-1.jpg",
      value: "0x56gc....23dt",
    },
  ];

  return (
    <div className={styles.walletcontainer}>
      <p className={styles.walletcontainer__title}>Send To</p>
      <div className={styles.walletcontainer__first}>
        {/* <div className={styles.walletcontainer__address}>
          <NowwaSelect
            label="From"
            startDecorator={true}
            data={fromAddress}
            type="outlined"
          />
        </div> */}
        <div className={styles.walletcontainer__address}>
          <p className={styles.walletcontainer__address__caption}>To</p>
          <TextField
            size="lg"
            variant="solid"
            placeholder="Search, public address(0x), or ENS"
            startDecorator={
              <img
                className={styles.walletcontainer__address__img}
                src="/images/content/avatar-1.jpg"
                alt="Avatar"
              />
            }
            sx={{
              div: {
                background: "#11141B",
              },
              background: "#11141B",
              "borderRadius": "8px",
              border: "1px solid #777E90",
            }}
            onChange={(e) => props.setRecipientAddress(e.target.value)}
          ></TextField>
        </div>
        <p className={styles.walletcontainer__transfer}>
          Transfer between my accounts
        </p>

        <div className={styles.walletcontainer__recent}>
          <p className={styles.walletcontainer__recent__label}>Recent</p>
          <div className={styles.walletcontainer__recent__item}>
            <img
              alt="img"
              src="/images/content/avatar-2.jpg"
              className={styles.walletcontainer__recent__item__img}
            ></img>
            <div className={styles.walletcontainer__recent__item__detail}>
              <p className={styles.walletcontainer__recent__lgtxt}>Beexay</p>
              <p className={styles.walletcontainer__recent__smalltxt}>
                0x3Dc6..Dxe2
              </p>
            </div>
          </div>
          <div className={styles.walletcontainer__recent__item}>
            <img
              alt="img"
              src="/images/content/avatar-7.jpg"
              className={styles.walletcontainer__recent__item__img}
            ></img>
            <div className={styles.walletcontainer__recent__item__detail}>
              <p className={styles.walletcontainer__recent__lgtxt}>Dasunnie</p>
              <p className={styles.walletcontainer__recent__smalltxt}>
                0x2G26..cD41
              </p>
            </div>
          </div>
          <div className={styles.walletcontainer__recent__item}>
            <img
              alt="img"
              src="/images/content/avatar-6.jpg"
              className={styles.walletcontainer__recent__item__img}
            ></img>
            <div className={styles.walletcontainer__recent__item__detail}>
              <p className={styles.walletcontainer__recent__lgtxt}>Geneae</p>
              <p className={styles.walletcontainer__recent__smalltxt}>
                0x3Dc6..Dxe2
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        className={cn("button-yellow", styles.btn)}
        onClick={() => {
          props.onNextStep();
        }}
        style={{ marginTop: "50px" }}
      >
        Next
      </button>
    </div>
  );
};

const Step2 = (props) => {
  const coinInfo = [
    // {
    //   sd_src: "/images/coins/btc.png",
    //   value: "Bitcoin",
    //   valueUsd: "19548",
    //   priceUsd: "306.46",
    //   balance: "0.0159277",
    // },
    {
      sd_src: "/images/coins/eth.png",
      value: "Ethereum",
      valueUsd: "2154",
      priceUsd: "1306.60",
      balance: "1",
    },
    // {
    //   sd_src: "/images/coins/bnb.png",
    //   value: "Bnb",
    //   valueUsd: "348",
    //   priceUsd: "$56.46",
    //   balance: "0.16",
    // },
  ];

  return (
    <div className={styles.walletcontainer}>
      <div className={styles.walletcontainer__title}>
        <p>Amount</p>
        <ArrowBackIosNewIcon
          className={styles.walletcontainer__title__prev}
          onClick={() => {
            props.onPrevStep();
          }}
        ></ArrowBackIosNewIcon>
      </div>

      <div className={styles.walletcontainer__info}>
        <div className={styles.walletcontainer__info__coin}>
          <NowwaSelect data={coinInfo} startDecorator={true} />
        </div>

        <div className={styles.row}>
          <div className={styles.walletcontainer__info__price}>
            <p>{props.balance}ETH</p>
            {/* <p className={styles.walletcontainer__info__price__below}>
              $121.33
            </p> */}
          </div>
          <div className={styles.walletcontainer__info__btn} onClick={() => props.setAmount(props.balance)}>Max</div>
        </div>
      </div>

      <div className={styles.walletcontainer__amount}>
        <input
          type="text"
          className={styles.walletcontainer__amountInput}
          value={props.amount}
          onChange={(e) => props.setAmount(e.target.value)}
        ></input>
      </div>

      {/* <div className={styles.walletcontainer__usdValue}>
        <p>$55.99312</p>
        <SwapVertIcon />
      </div> */}

      <button
        className={cn("button-yellow", styles.btn)}
        onClick={() => {
          props.onNextStep();
        }}
        style={{ marginTop: "150px" }}
      >
        Next
      </button>
    </div>
  );
};

const Step3 = (props) => {
  return (
    <div className={styles.walletcontainer}>
      <div className={styles.walletcontainer__title}>
        <p>Confirm</p>
        <ArrowBackIosNewIcon
          className={styles.walletcontainer__title__prev}
          onClick={() => {
            props.onPrevStep();
          }}
        ></ArrowBackIosNewIcon>
      </div>

      <div className={styles.walletcontainer__amount}>{props.amount} {props.token}</div>
      <div className={styles.walletcontainer__first}>
        {/* <div className={styles.walletcontainer__address}>
          <p className={styles.walletcontainer__address__caption}>From</p>
          <TextField
            size="lg"
            variant="solid"
            placeholder="Search, public address(0x), or ENS"
            startDecorator={
              <img
                className={styles.walletcontainer__address__img}
                src="/images/content/avatar-1.jpg"
                alt="Avatar"
              />
            }
            sx={{
              div: {
                background: "#23262F",
              },
              background: "#23262F",
              border: "1px solid #23262F",
              "borderRadius": "8px",
            }}
            value="0x4fd4....89u3"
          ></TextField>
        </div> */}
        <div className={styles.walletcontainer__address}>
          <p className={styles.walletcontainer__address__caption}>To</p>
          <TextField
            size="lg"
            variant="solid"
            placeholder="Search, public address(0x), or ENS"
            startDecorator={
              <img
                className={styles.walletcontainer__address__img}
                src="/images/content/avatar-1.jpg"
                alt="Avatar"
              />
            }
            sx={{
              div: {
                background: "#23262F",
              },
              background: "#23262F",
              border: "1px solid #23262F",
              "borderRadius": "8px",
            }}
            value={props.recipientAddress}
            disabled
          ></TextField>
        </div>

        <div className={styles.linebox}>
          <div className={styles.row}>
            <p className={styles.walletcontainer__review__smallItem}>Amount</p>
            <p className={styles.walletcontainer__review__smallItem}>
              {props.amount} {props.token}
            </p>
          </div>
          <div className={styles.row}>
            <div className={styles.walletcontainer__review__item}>
              <p className={styles.walletcontainer__review__smallItem}>
                Network Fee
              </p>
              <p className={styles.walletcontainer__review__edit}>Edit</p>
            </div>
            <p className={styles.walletcontainer__review__smallItem}>
              {props.fee} {props.token}
            </p>
          </div>
          <div className={styles.topalignrow}>
            <p className={styles.walletcontainer__review__largeItem}>
              Total Amount
            </p>
            <div>
              <p className={styles.walletcontainer__review__largeItem}>
                {DECIMALS.plus(props.amount, props.fee)} {props.token}
              </p>
              {/* <p
                className={styles.walletcontainer__review__smallItem}
                style={{ "text-align": "right" }}
              >
                $0.558432
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <button
        className={cn("button-yellow", styles.btn)}
        onClick={() => { props.funcSend() }}
        style={{ marginTop: "30px" }}
      >
        Send
      </button>
    </div>
  );
};

const WalletSendToken = () => {
  //conquer
  const { balance, send } = useContext(WalletContext)

  const [step, setStep] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState()
  const [token, setToken] = useState('ETH')
  const [amount, setAmount] = useState(1)
  const [fee, setFee] = useState(WITHDRAW_FEES.ETH)

  const funcSend = async () => {
    await send(recipientAddress, amount, () => { window.location.href = "/wallet"; });
  }

  return (
    <>
      <div className={styles.wallet}>
        {step === 0 && (
          <Step1
            onNextStep={() => {
              setStep(1);
            }}
            setRecipientAddress={setRecipientAddress}
          />
        )}
        {step === 1 && (
          <Step2
            onNextStep={() => {
              setStep(2);
            }}
            onPrevStep={() => {
              setStep(0);
            }}
            balance={balance}
            amount={amount}
            setAmount={setAmount}
          />
        )}
        {step === 2 && (
          <Step3
            onPrevStep={() => {
              setStep(1);
            }}
            recipientAddress={recipientAddress}
            amount={amount}
            token={token}
            fee={fee}
            funcSend={funcSend}
          />
        )}
      </div>
    </>

  );
};

export default WalletSendToken;
