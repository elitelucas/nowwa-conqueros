import { ethers, BigNumber, utils } from "ethers";
import contractAbI from "../../../NewPages/constants/nft_abi_testnet.json"

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

export async function mint(privateKey, amount, mintPrice) {
    try {
        if (await getChain(provider) === 5) {

            const wallet = await getWallet(privateKey)
            const nonce = await getNonce(wallet)
            const gasFee = await getGasPrice()

            let rawTxn = await contractInstance.populateTransaction.mint(amount, {
                gasPrice: gasFee * 2,
                gasLimit: utils.parseUnits('90000', 0),
                nonce: nonce,
                value: utils.parseEther(Number(mintPrice * amount).toString())
            })
            console.log(rawTxn)
            console.log("...Submitting transaction with gas price of:", utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
            let signedTxn = await wallet.sendTransaction(rawTxn);
            console.log(signedTxn)

            let reciept = await signedTxn.wait()
            if (reciept) {
                console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", signedTxn.hash + '\n' + "Block Number:" + reciept.blockNumber + '\n' + "Navigate to https://goerli.etherscan.io/tx/" + signedTxn.hash, "to see your transaction")
                return {
                    result: true,
                    data: signedTxn.hash
                }
            } else {
                console.log("Error submitting transaction")
                return {
                    result: false,
                    message: "Error submitting transaction"
                }
            }
        }
        else {
            console.log("Wrong network - Connect to configured chain ID first!")
            return {
                result: false,
                message: "Wrong network - Connect to configured chain ID first!"
            }
        }
    } catch (e) {
        console.log("Error Caught in Catch Statement: ", e)
        return {
            result: false,
            message: e.message
        }
    }
}

export async function getTotalSupply() {
    let totalSupply = await contractInstance.totalSupply(); //bignumber
    // console.log(totalSupply.toString()) 
    return utils.formatUnits(totalSupply, 0);
}
