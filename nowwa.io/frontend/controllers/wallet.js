const url = {
  wss: process.env.ETH_WS,
  http: process.env.ETH_HTTP,
};
const ethers = require("ethers");
const wssprovider = new ethers.providers.WebSocketProvider(url.wss);

// temp
var xxxDBaddresses = ["0xecFA21cfFcb7BDeE55D137486Dea0d7984c72619", "0x42E8c710Cff480eDF060e6d5cC385c01f55C88F4"];
// ~temp

let initMempool = async () => {
  wssprovider.on("pending", (tx) => {
    wssprovider
      .getTransaction(tx)
      .then(function (transaction) {
        try {
          checkDepositTransaction(transaction);
        } catch (e) {
          console.log("[ERROR]->iwwgte");
        }
      })
      .catch((error) => {
        console.log("[ERROR in WSSprovider]");
      });
  });
};

setTimeout(async () => {
  console.log(`__________Wallet Started______________ `);
  try {
    initMempool();
  } catch (e) {
    console.log(e);
  }
}, 3000);

const checkDepositTransaction = (transaction) => {
  const value = ethers.utils.formatUnits(transaction.value); //ethers amount
  if (Number(value) > 0) {
    var txTo = transaction.to;
    // console.log(transaction.hash, transaction.from, '-->', transaction.to, value, 'ETH')
    if (xxxDBaddresses.includes(txTo)) {//if txTo is users' wallet
      console.log("----------- here", transaction.hash, transaction.from, '-->', transaction.to, value, 'ETH');
    }
  }
};
