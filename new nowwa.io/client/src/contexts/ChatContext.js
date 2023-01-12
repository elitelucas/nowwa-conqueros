import { set } from 'local-storage';
import React, { createContext, useState, useEffect, useContext } from 'react'
import { ConquerContext } from './ConquerContext';

export const ChatContext = createContext()

const ChatContextProvider = (props) => {
  //conquer
  const { CONQUER } = useContext(ConquerContext)
  const [myAvatarID, setMyAvatarID] = useState();
  const [rooms, setRooms] = useState([]);
  const [currentRoomInstance, setCurrentRoomInstance] = useState();
  const [entries, setEntries] = useState([]);


  useEffect(async () => {
    if (!CONQUER) return;
    setMyAvatarID(CONQUER.User.avatarID)

    await CONQUER.Rooms.get({});
    let pool = CONQUER.Rooms.pool;
    setRooms(Object.values(pool))
  }, [CONQUER]);


  const onSelectRoom = async (avatarIDs) => {
    setEntries([])

    let roomInstance = await CONQUER.Rooms.getOne(avatarIDs);
    setCurrentRoomInstance(roomInstance)

    roomInstance.onMessage = function (server_message) {
      console.log("GOT MESSAGE", server_message);
      if (server_message.action == 33) //send message
      {
        onReceiveMessage(server_message.data, server_message.avatarID)
      }
    }
    await roomInstance.join()

    let entries = await roomInstance.Entries.get();
    setEntries(entries)
    console.log(entries)
  }

  const onReceiveMessage = (text, avatarID) => {
    setEntries((entries) => {
      return [...entries, { text: text, avatarID: avatarID, timestamp: Date.now() }];
    });
  }


  const sendMessage = async (text) => {
    await currentRoomInstance.entry(text)
    setEntries((entries) => {
      return [...entries, { text: text, avatarID: myAvatarID, timestamp: Date.now() }];
    });
  }

  return (
    <ChatContext.Provider
      value={{
        myAvatarID,
        rooms,
        entries,
        onSelectRoom,
        sendMessage
      }}>
      {props.children}
    </ChatContext.Provider>
  )
}
export default ChatContextProvider