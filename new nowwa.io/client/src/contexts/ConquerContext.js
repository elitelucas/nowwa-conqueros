import { set } from 'local-storage';
import React, { createContext, useState, useEffect } from 'react'
export const ConquerContext = createContext()
const ConquerContextProvider = (props) => {
  const [CONQUER, setCONQUER] = useState();

  //user
  const [username, setUsername] = useState();
  const [loggedin, setLoggedin] = useState(false);
  const logout = async () => {
    await CONQUER.Auth.logout();
    whenConquerChanged(CONQUER)
    goHome();
  }
  const login = async (email, password) => {
    try {
      let res = await CONQUER.Auth.get({
        username: email,
        password: password
      });
      /*
        response
        {
            "avatarID": "63ac6c2534bba89538a2fdd4",
            "firstName": "aaa@gmail.com",
            "admin": false,
            "username": "aaa@gmail.com",
            "token": "$2b$10$T.sztSYlRNGOEGB3QHbVq.JAA3BgFfR/M3pOGowwrssq2j/0ExNyS",
            "friend_count": 0,
            "socketID": "oNlLwBLXYuUGiIEpAAAl"
        }
      */
      if (res.username) {
        whenConquerChanged(CONQUER)
      } else {
        alert(res)
      }

    } catch (e) {
      console.log(e)
    }

  }

  //wallet
  const [walletInstance, setWalletInstance] = useState();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [history, setHistory] = useState([]);
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

  //Avatar
  const getAvatars = async () => {

    let res = await CONQUER?.Avatars.get();
    return res;
  }

  //my handling
  useEffect(() => {
    const script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = "/js/CONQUER.js";
    script.async = true;
    script.defer = true;

    script.onload = async () => {
      let myconquer = new window.CONQUER();
      await myconquer.init();

      setCONQUER(myconquer)
    }

    document.body.appendChild(script);
  }, []);

  useEffect(async () => {
    if (!CONQUER?.User) return;
    await whenConquerChanged(CONQUER);
  }, [CONQUER]);

  const whenConquerChanged = async (CONQUER) => {
    let myconquer = CONQUER;
    console.log('----->myconquer', myconquer)

    let username = myconquer?.User.username
    console.log('----->username', username)
    setUsername(username)

    let loggedin;
    if (username && !username.includes('Guest')) loggedin = true;
    else loggedin = false;
    setLoggedin(loggedin)

    // Wallet
    let address, balance, history = [];

    if (loggedin) {
      let res = await myconquer.Wallets.get();
      if (res.success) {
        let walletInstance = res.data
        setWalletInstance(walletInstance)
        console.log('----->walletInstance', walletInstance)

        address = walletInstance.address
        balance = walletInstance.balance

        history = await walletInstance.History.get();
        history = history.reverse();
      } else {
        console.log('wallet get failed', res.message)
      }
    }

    setAddress(address)
    setBalance(balance)
    setHistory(history)

  }

  const goHome = async () => {
    window.location.href = "/";
  };

  return (
    <ConquerContext.Provider
      value={{
        CONQUER,
        //User
        username,
        loggedin,
        logout,
        login,
        //Wallet
        address,
        balance,
        history,
        send,
        //Avatar,
        getAvatars,
      }}>
      {props.children}
    </ConquerContext.Provider>
  )
}
export default ConquerContextProvider