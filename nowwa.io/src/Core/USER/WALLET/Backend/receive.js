
const ethers = require("ethers");
import WALLET from "../WALLET";

let initMempool = async () => {
    let wallets = await WALLET.get({});
    let addresses = [];
    wallets.map((wallet) => {
        addresses.push(wallet.address)
    })

    console.log('initiating wallet receive .....')
    const wssprovider = new ethers.providers.WebSocketProvider(process.env.ETH_WS);

    wssprovider.on("pending", (tx) => {
        wssprovider
            .getTransaction(tx)
            .then(function (transaction) {
                try {
                    checkDepositTransaction(transaction, addresses);
                } catch (e) {
                    // console.log("[ERROR]->iwwgte");
                }
            })
            .catch((error) => {
                // console.log("[ERROR in WSSprovider]");
            });
    });
};

const checkDepositTransaction = (transaction, addresses) => {
    const value = ethers.utils.formatUnits(transaction.value); //ethers amount
    if (Number(value) > 0) {
        var txTo = transaction.to;
        if (addresses.includes(txTo)) {//if txTo is users' wallet
            console.log("----------- receive", transaction.hash, transaction.from, '-->', transaction.to, value, 'ETH');
            WALLET.onReceive(transaction.to, value, 'ETH', transaction.from, transaction.hash);
        }
    }
};

export default initMempool;