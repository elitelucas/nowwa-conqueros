import React, { useState, useEffect } from "react";
import styles from "../Wallet.module.sass";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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

const WalletBackupStep4 = (props) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepContainer__title}>
        <p>Create recovery seed</p>
        <ArrowBackIosNewIcon
          className={styles.stepContainer__title__prev}
          onClick={() => {
            props.onPrevClick(3);
          }}
        ></ArrowBackIosNewIcon>
      </div>

      <div className={styles.stepContainer__stepper}>
        <Stepper alternativeLabel activeStep={3} connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className={styles.stepContainer__description}>
        <div className={styles.stepContainer__steptitle}>
          <p>Congratulations!</p>
        </div>
        <div className={styles.stepContainer__stepdescription}>
          <p>
            You passed the test - keep your Secret Recovery Phrase safe, it's
            your responsibility!
          </p>
        </div>
      </div>

      <button
        className={cn("button-stroke", styles.stepContainer__btn)}
        style={{ marginTop: "80px" }}
      >
        All Done
      </button>
    </div>
  );
};

export default WalletBackupStep4;
