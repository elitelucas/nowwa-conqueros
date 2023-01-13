import React, { useState, useEffect } from "react";
import styles from "./Wallet.module.sass";
import WalletBackupStep1 from "./Step1";
import WalletBackupStep2 from "./Step2";
import WalletBackupStep3 from "./Step3";
import WalletBackupStep4 from "./Step4";

const WalletBackup = () => {
  const [step, setStep] = useState(1);

  const onPrevClick = (_step) => {
    setStep(_step);
  };

  const onNextClick = (_step) => {
    setStep(_step);
  };

  return (
    <div className={styles.wallet}>
      {step === 1 && <WalletBackupStep1 onNextClick={onNextClick} />}
      {step === 2 && (
        <WalletBackupStep2
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
        />
      )}
      {step === 3 && (
        <WalletBackupStep3
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
        />
      )}
      {step === 4 && (
        <WalletBackupStep4
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
        />
      )}
    </div>
  );
};

export default WalletBackup;
