import { set } from 'local-storage';
import React, { createContext, useState, useEffect, useContext } from 'react'
import { ConquerContext } from './ConquerContext';

export const ChatContext = createContext()

const ChatContextProvider = (props) => {
  //conquer
  const { CONQUER, getAllAvatars } = useContext(ConquerContext)
  const [myAvatarID, setMyAvatarID] = useState();
  const [allAvatars, setAllAvatars] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoomInstance, setCurrentRoomInstance] = useState();
  const [currentRoomID, setCurrentRoomID] = useState('noroom');
  const [currentRoomMemberNames, setCurrentRoomMemberNames] = useState([]);
  const [entries, setEntries] = useState([]);

  //Page components
  const [isWelcomePage, setIsWelcomePage] = useState(true);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(true);


  useEffect(async () => {
    if (!CONQUER) return;
    setMyAvatarID(CONQUER.User.avatarID)

    setLoadingRooms(true)

    let allAvatars = await getAllAvatars();
    setAllAvatars(allAvatars)

    await CONQUER.Rooms.get({});
    let pool = CONQUER.Rooms.pool;
    setRooms(Object.values(pool))

    setLoadingRooms(false)
  }, [CONQUER]);


  const onSelectRoom = async (roomInstance) => {
    setIsWelcomePage(false)
    setCurrentRoomID(roomInstance.roomID)
    setCurrentRoomMemberNames([])
    setLoadingEntries(true)

    console.log(roomInstance)
    setCurrentRoomInstance(roomInstance)

    roomInstance.onMessage = function (server_message) {
      console.log("GOT MESSAGE", server_message);
      if (server_message.action == 33) //send message
      {
        if (roomInstance.roomID == server_message.roomID)
          addMessagetoContent(server_message.data, server_message.avatarID)
      }
    }
    await roomInstance.join()

    let entries = await roomInstance.Entries.get();
    setEntries(entries)
    setLoadingEntries(false)

    let memberNames = [];
    allAvatars.map((avatarInstance) => {
      if (roomInstance.avatarIDs.includes(avatarInstance.avatarID))
        memberNames.push(avatarInstance.firstName)
    })
    setCurrentRoomMemberNames(memberNames)
  }

  const addMessagetoContent = (text, avatarID) => {
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

  const createRoom = async (avatarIDsArray, roomName) => {
    console.log('creatingRoom', avatarIDsArray)
    let roomInstance = await CONQUER?.Rooms.set(avatarIDsArray, roomName);
    console.log(roomInstance)
    setShowNewRoomModal(false)
    setRooms([...rooms, roomInstance])
    await onSelectRoom(roomInstance)
  }

  const getUserNamebyAvatarID = (avatarID) => {
    for (var i = 0; i < allAvatars.length; i++)
      if (avatarID == allAvatars[i].avatarID)
        return allAvatars[i].firstName
    return 'Unknown'
  }




  return (
    <ChatContext.Provider
      value={{
        //conquer
        allAvatars,
        myAvatarID,
        getUserNamebyAvatarID,
        rooms,
        entries,
        onSelectRoom,
        sendMessage,
        createRoom,
        currentRoomInstance,
        currentRoomID,
        currentRoomMemberNames,

        //components
        showNewRoomModal,
        setShowNewRoomModal,
        loadingRooms,
        loadingEntries,
        isWelcomePage
      }}>
      {props.children}
    </ChatContext.Provider>
  )
}
export default ChatContextProvider