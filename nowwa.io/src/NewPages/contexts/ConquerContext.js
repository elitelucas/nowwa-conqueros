import React, { createContext, useState, useEffect } from 'react';
import { plus } from '../../UTIL/DECIMALS';
import CONQUER from '../../Conquer/CONQUER';

export const ConquerContext = createContext()

const ConquerContextProvider = (props) => {
  const [ConquerState, setConquerState] = useState();
  //load CONQER
  useEffect(() => {
    console.log('testing utils....', plus(0.12345, 0.234567))

    /* Load js file */
    // const script = document.createElement("script");
    // script.type = 'text/javascript';
    // script.src = "/js/CONQUER.js";
    // script.async = true;
    // script.defer = true;
    let asyncFunction = async () => {
      let mconquer = new CONQUER();
      await mconquer.init();
      setConquerState(mconquer);
    }

    asyncFunction();

    /* Load typescript file */
    // let myconquer = new RAWCONQUER();
    // await myconquer.init();

    // setCONQUER(myconquer)
  }, []);

  //user
  const [username, setUsername] = useState();
  const [myAvatarID, setMyAvatarID] = useState();
  const [loggedin, setLoggedin] = useState(false);

  const logout = async () => {
    await ConquerState.Auth.logout();
    onConquerChanged(ConquerState)
    goHome();
  }

  const login = async (email, password) => {
    try {
      let res = await ConquerState.Auth.get({
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
        onConquerChanged(ConquerState)
      } else {
        alert(res)
      }

    } catch (e) {
      console.log(e)
    }

  }


  //Avatar
  const getAllAvatars = async () => {
    let res = await ConquerState?.Avatars.get();
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
    let res = await ConquerState?.Avatars.get(avatarIDsArray);
    return res;
  }

  //my handling
  useEffect(() => {
    let asyncFunction = async () => {
      if (!ConquerState?.User) return;
      await onConquerChanged(ConquerState);
    }
    asyncFunction();
  }, [ConquerState]);

  const onConquerChanged = async (CONQUER) => {
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

  }

  const goHome = async () => {
    window.location.href = "/";
  };

  return (
    <ConquerContext.Provider
      value={{
        CONQUER: ConquerState,
        //User
        username,
        myAvatarID,
        loggedin,
        logout,
        login,
        //Avatar,
        getAllAvatars,
        getAvatars,
      }}>
      {props.children}
    </ConquerContext.Provider>
  )
}
export default ConquerContextProvider