import React, { useState, useEffect } from "react";
import styles from "../Wallet.module.sass";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Checkbox from "@mui/material/Checkbox";
import DoneIcon from "@mui/icons-material/Done";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import cn from "classnames";

const steps = ["1", "2", "3", "4"];
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1975d2",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1975d2",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#23262F",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const WalletBackupStep1 = (props) => {
  const [checkTip1, setCheckTip1] = useState(false);
  const [checkTip2, setCheckTip2] = useState(false);
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepContainer__title}>
        <p>Create recovery seed</p>
        <ArrowBackIosNewIcon
          className={styles.stepContainer__title__prev}
        ></ArrowBackIosNewIcon>
      </div>

      <div className={styles.stepContainer__stepper}>
        <Stepper alternativeLabel connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className={styles.stepContainer__description}>
        <div className={styles.stepContainer__steptitle}>
          <p>Back up your wallet now</p>
        </div>
        <div className={styles.stepContainer__stepdescription}>
          <p>
            In the next step you will see secret seed(12 words) that allows you
            to secure and recover a wallet.
          </p>
        </div>
      </div>

      <div className={styles.stepContainer__tip}>
        <p className={styles.stepContainer__tip__title}>I understand:</p>
        <div className={styles.stepContainer__tip__box}>
          <p>If i lose my secret seed, the wallet will not be recoverable</p>
          <Checkbox
            className={styles.stepContainer__tip__box__check}
            value={checkTip1}
            onChange={(e) => {
              setCheckTip1(e.target.checked);
            }}
          />
        </div>
        <div className={styles.stepContainer__tip__box}>
          <p>
            If i expose or share my secret seed to anybody, my funds can be
            stolen
          </p>
          <Checkbox
            className={styles.stepContainer__tip__box__check}
            value={checkTip2}
            onChange={(e) => {
              setCheckTip2(e.target.checked);
            }}
          />
        </div>
      </div>

      <button
        className={cn("button-stroke", styles.stepContainer__btn)}
        onClick={() => {
          if (checkTip1 && checkTip2) props.onNextClick(2);
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default WalletBackupStep1;
