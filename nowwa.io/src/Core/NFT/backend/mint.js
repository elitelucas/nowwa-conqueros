import { ethers, BigNumber, utils } from "ethers";
import contractAbI from "../../../NewPages/constants/nft_abi_testnet.json"

const privateKey = '69029364412a73de7f333074a4ed83a9ddc10481d043f0836ead289fa324737d'

const QUICKNODE_HTTP_ENDPOINT = "https://eth-goerli.g.alchemy.com/v2/uT1y43AbY-Xx4j7VW_MOANJM3XylZzCi"
const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_HTTP_ENDPOINT)

const contractAddress = "0xe74da0a4e7c5fc09fa793498cce70e598d8432b2"
const contractInstance = new ethers.Contract(contractAddress, contractAbI, provider)

async function getGasPrice() {
    let feeData = await provider.getFeeData()
    return feeData.gasPrice
}

async function getWallet(privateKey) {
    const wallet = await new ethers.Wallet(privateKey, provider)
    return wallet
}

async function getChain(_provider) {
    let chainId = await _provider.getNetwork()
    return chainId.chainId
}

async function getContractInfo(index, id) {
    let contract = await contractInstance.getERC1155byIndexAndId(index, id)
    return contract;
}

async function getNonce(signer) {
    return (await signer).getTransactionCount()
}

async function mint(amount, presalePrice) {
    try {
        if (await getChain(provider) === 5) {

            const wallet = await getWallet(privateKey)
            const nonce = await getNonce(wallet)
            const gasFee = await getGasPrice()
            let rawTxn = await contractInstance.populateTransaction.mint(amount, {
                gasPrice: gasFee,
                nonce: nonce,
                value: utils.parseUnits('0.007', 18)
            })
            console.log(rawTxn)
            console.log("...Submitting transaction with gas price of:", utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
            let signedTxn = await wallet.sendTransaction(rawTxn);
            console.log(signedTxn)

            let reciept = await signedTxn.wait()
            if (reciept) {
                console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", signedTxn.hash + '\n' + "Block Number:" + reciept.blockNumber + '\n' + "Navigate to https://goerli.etherscan.io/tx/" + signedTxn.hash, "to see your transaction")
            } else {
                console.log("Error submitting transaction")
            }
        }
        else {
            console.log("Wrong network - Connect to configured chain ID first!")
        }
    } catch (e) {
        console.log("Error Caught in Catch Statement: ", e)
    }
}

export default mint;
