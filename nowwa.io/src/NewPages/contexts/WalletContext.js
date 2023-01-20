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

  //Page components
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);


  useEffect(() => {
    let asyncFunction = async () => {
      if (!CONQUER) return;

      // Wallet
      let address, balance, history = [];

      if (loggedin) {
        setLoadingWallet(true)
        setLoadingActivity(true)

        let res = await CONQUER.Wallets.get();
        if (res.success) {
          let walletInstance = res.data
          setWalletInstance(walletInstance)
          // console.log('----->walletInstance', walletInstance)

          address = walletInstance.address
          setAddress(address)

          balance = walletInstance.balance
          setBalance(balance)

          setLoadingWallet(false)


          history = await walletInstance.History.get();
          history = history.reverse();
          setHistory(history)

          setLoadingActivity(false)

        } else {
          console.log('wallet get failed', res.message)
          setLoadingWallet(false)
        }
      }

      
    }
    asyncFunction();

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
        send,
        //page
        loadingWallet,
        loadingActivity
      }}>
      {props.children}
    </WalletContext.Provider>
  )
}
export default WalletContextProvider