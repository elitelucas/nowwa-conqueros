import { set } from 'local-storage';
import React, { createContext, useState, useEffect } from 'react'
import { plus } from '../UTIL/DECIMALS'
import CONQUER from '../Frontend/CONQUER'

export const ConquerContext = createContext()

const ConquerContextProvider = (props) => {
  const [myConquer, setCONQUER] = useState();
  useEffect(async () => {
    console.log('testing utils....', plus(0.12345, 0.234567))

    /* Load js file */
    // const script = document.createElement("script");
    // script.type = 'text/javascript';
    // script.src = "/js/CONQUER.js";
    // script.async = true;
    // script.defer = true;

    // script.onload = async () => {
    //   console.log(123)
    //   let mconquer = new window.CONQUER();
    //   await mconquer.init();
    //   console.log(234)
    //   setCONQUER(mconquer)
    // }

    // document.body.appendChild(script);


    /* Load typescript file */
    let myconquer = new CONQUER();
    await myconquer.init();

    setCONQUER(myconquer)
  }, []);

  //user
  const [username, setUsername] = useState();
  const [myAvatarID, setMyAvatarID] = useState();
  const [loggedin, setLoggedin] = useState(false);
  const logout = async () => {
    await myConquer.Auth.logout();
    whenConquerChanged(myConquer)
    goHome();
  }
  const login = async (email, password) => {
    try {
      let res = await myConquer.Auth.get({
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
        whenConquerChanged(myConquer)
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
  const getAllAvatars = async () => {
    let res = await myConquer?.Avatars.get();
    /*
    [...
    {
      avatarID: "63bd738d7d18ac60a60e4dd3"
      firstName: "aaa@gmail.com"
      userPhoto: undefined
    },
    ]
    
    */
    return res;
  }

  const getAvatars = async (avatarIDsArray) => {
    let res = await myConquer?.Avatars.get(avatarIDsArray);
    return res;
  }

  //my handling
  useEffect(async () => {
    if (!myConquer?.User) return;
    await whenConquerChanged(myConquer);
  }, [myConquer]);

  const whenConquerChanged = async (CONQUER) => {
    let mconquer = CONQUER;
    console.log('----->myconquer', mconquer)

    let username = mconquer?.User.username
    console.log('----->username', username)
    setUsername(username)

    let avatarID = mconquer?.User.avatarID
    console.log('----->avatarID', avatarID)
    setMyAvatarID(avatarID)

    let loggedin;
    if (username && !username.includes('Guest')) loggedin = true;
    else loggedin = false;
    setLoggedin(loggedin)

    // Wallet
    return;
    let address, balance, history = [];

    if (loggedin) {
      let res = await mconquer.Wallets.get();
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
        CONQUER: myConquer,
        //User
        username,
        myAvatarID,
        loggedin,
        logout,
        login,
        //Wallet
        address,
        balance,
        history,
        send,
        //Avatar,
        getAllAvatars,
        getAvatars,
      }}>
      {props.children}
    </ConquerContext.Provider>
  )
}
export default ConquerContextProvider