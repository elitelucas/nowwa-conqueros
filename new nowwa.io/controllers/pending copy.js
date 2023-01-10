var url = "wss://eth-mainnet.g.alchemy.com/v2/H1iPzARYJNFgmr4u6F0d9AExC5hExRKc";

var ethers = require("ethers");

var init = function () {
    var customWsProvider = new ethers.providers.WebSocketProvider(url);
    customWsProvider.on("pending", (tx) => {
        customWsProvider.getTransaction(tx).then(function (transaction) {
            if (transaction.hash)
                console.log(transaction.hash);
        });
    });

    customWsProvider._websocket.on("error", async () => {
        console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
        setTimeout(init, 3000);
    });
    customWsProvider._websocket.on("close", async (code) => {
        console.log(
            `Connection lost with code ${code}! Attempting reconnect in 3s...`
        );
        customWsProvider._websocket.terminate();
        setTimeout(init, 3000);
    });
};

init();