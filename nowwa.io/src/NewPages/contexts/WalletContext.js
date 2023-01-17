import React, { createContext, useState, useEffect, useContext } from 'react'
import { ConquerContext } from './ConquerContext';

export const WalletContext = createContext()

const WalletContextProvider = (props) => {
  //conquer
  const { CONQUER, loggedin } = useContext(ConquerContext)

  //wallet
  const [walletInstance, setWalletInstance] = useState();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [history, setHistory] = useState([]);

  useEffect(async () => {
    if (!CONQUER) return;

    // Wallet
    let address, balance, history = [];

    if (loggedin) {
      let res = await CONQUER.Wallets.get();
      if (res.success) {
        let walletInstance = res.data
        setWalletInstance(walletInstance)
        // console.log('----->walletInstance', walletInstance)

        address = walletInstance.address
        setAddress(address)

        balance = walletInstance.balance
        setBalance(balance)

        history = await walletInstance.History.get();
        history = history.reverse();
        setHistory(history)
      } else {
        console.log('wallet get failed', res.message)
      }
    }
  }, [CONQUER, loggedin]);


  const send = async (recipient, amount, callback) => {
    let res = await walletInstance.send(recipient, amount);
    if (res.success) {
      console.log('success', res.data)
      callback()
    } else {
      alert(res.message)
      return;
    }
  }



  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        history,
        send
      }}>
      {props.children}
    </WalletContext.Provider>
  )
}
export default WalletContextProvider