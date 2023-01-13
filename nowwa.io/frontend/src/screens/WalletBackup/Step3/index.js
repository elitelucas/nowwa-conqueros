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

const seeds = [
  "question",
  "interest",
  "festival",
  "conflict",
  "security",
  "recovery",
  "apple",
  "business",
  "social",
  "pie",
  "coffee",
  "resist",
];

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

const WalletBackupStep3 = (props) => {
  const [selectedPhrases, setSelectedPhrases] = useState([]);
  const [phrase, setPhrase] = useState([]);

  useEffect(() => {
    let _phrase = [];
    seeds.map((seed, index) => {
      const _seed = { seed: seed, select: false };
      _phrase.push(_seed);
    });
    setPhrase(_phrase);
  }, []);

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepContainer__title}>
        <p>Create recovery seed</p>
        <ArrowBackIosNewIcon
          className={styles.stepContainer__title__prev}
          onClick={() => {
            props.onPrevClick(2);
          }}
        ></ArrowBackIosNewIcon>
      </div>

      <div className={styles.stepContainer__stepper}>
        <Stepper alternativeLabel activeStep={2} connector={<QontoConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className={styles.stepContainer__description}>
        <div className={styles.stepContainer__steptitle}>
          <p>Confirm your Secret Recovery Phrase</p>
        </div>
        <div className={styles.stepContainer__stepdescription}>
          <p>Please select each phrase in order to make sure it is correct.</p>
        </div>
      </div>

      <div className={styles.stepContainer__seedbox}>
        {selectedPhrases.map((seed, index) => {
          return (
            <div className={styles.stepContainer__seedbox__seed}>{seed}</div>
          );
        })}
      </div>

      <div className={styles.stepContainer__seedbox1}>
        {phrase.map((seed, index) => {
          return (
            <div
              className={
                seed.select
                  ? styles.stepContainer__seedbox1__selectseed
                  : styles.stepContainer__seedbox1__seed
              }
              onClick={() => {
                let _phrase = phrase;
                let _selectedPhrase = selectedPhrases;
                _phrase.map((_seed, index) => {
                  if (_seed.seed === seed.seed) {
                    _seed.select = !_seed.select;
                    if (_seed.select) {
                      _selectedPhrase.push(_seed.seed);
                    } else {
                      const _index = _selectedPhrase.indexOf(_seed.seed);
                      if (_index > -1) _selectedPhrase.splice(_index, 1);
                    }
                    setSelectedPhrases([..._selectedPhrase]);
                  }
                });
                setPhrase([..._phrase]);
              }}
            >
              {seed.seed}
            </div>
          );
        })}
      </div>

      <button
        className={cn("button-stroke", styles.stepContainer__btn)}
        onClick={() => {
          props.onNextClick(4);
        }}
      >
        Confirm
      </button>
    </div>
  );
};

export default WalletBackupStep3;
