class WALLET_CONFIG {
  public static WITHDRAW_FEES = {
    BTC: 0.005,
    ETH: 0.005,
    BNB: 0.005,
    AVAX: 0.01,
    MATIC: 1,
    USDT: 25,
    USDC: 20,
    DAI: 6,
  };
}

export var WITHDRAW_FEES = WALLET_CONFIG.WITHDRAW_FEES;

export default WALLET_CONFIG;
