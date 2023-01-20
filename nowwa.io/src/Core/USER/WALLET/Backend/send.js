const ethers = require("ethers");

// let contract_address = "" //if it is native token then give "", else give token contract address
// let send_token_amount = "0.0004"
// let to_address = "0x42E8c710Cff480eDF060e6d5cC385c01f55C88F4"
// let from_address = "0x971c96De2114B553Aa6aBB8f0e714c2Fd51a6017"
// let gas_limit = "0x100000"
// let private_key =
//   "69029364412a73de7f333074a4ed83a9ddc10481d043f0836ead289fa324737d"

// send_token(
//   contract_address,
//   send_token_amount,
//   to_address,
//   from_address,
//   private_key
// )

async function send_token(
  contract_address,
  send_token_amount,
  to_address,
  send_account,
  private_key
) {
  try {
    let ethersProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_HTTP)
    let wallet = new ethers.Wallet(private_key)
    let walletSigner = wallet.connect(ethersProvider)

    let currentGasPrice = await ethersProvider.getGasPrice();
    let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
    console.log(`gas_price: ${gas_price}`)

    if (contract_address) {
      // general token send
      let contract = new ethers.Contract(
        contract_address,
        send_abi,
        walletSigner
      )

      // How many tokens?
      let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
      console.log(`numberOfTokens: ${numberOfTokens}`)

      // Send tokens
      contract.transfer(to_address, numberOfTokens).then((transferResult) => {
        console.log(transferResult)
        console.log("sent token")
        return transferResult;   //check if this is transaction
      })
    } // ether send
    else {
      let gas_limit = "0x100000"
      const tx = {
        from: send_account,
        to: to_address,
        value: ethers.utils.parseEther(send_token_amount),
        nonce: ethersProvider.getTransactionCount(
          send_account,
          "latest"
        ),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price,
      }
      console.log(tx)
      try {
        let transaction = await walletSigner.sendTransaction(tx);
        console.log(transaction)
        console.log("Send finished!")
        return transaction.hash;
      } catch (error) {
        console.log("failed to send!!")
        return false;
      }
    }


  } catch (e) {
    return false;
  }

}

export default send_token;