import React, { useState, useEffect, useContext } from "react";
import styles from "./my.module.sass";
import Icon from "../../../components/Icon";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Avatar from 'react-avatar';
import { ConquerContext } from "../../../contexts/ConquerContext";
import { ChatContext } from "../../../contexts/ChatContext";

const UserItem = ({ name, state, photoSrc, itemClicked }) => {
  return (
    <div className={styles.tokens__list__item} onClick={() => itemClicked()}>
      <Avatar name={name} round={true} size={40}/>
      <p className={styles.tokens__list__item__name}>{name}</p>
      <div className={styles.tokens__list__item__switch}>
        {state && <CheckCircleIcon />}
      </div>
    </div>
  );
};

const NewRoom = (props) => {
  //conquer
  const { getAllAvatars, myAvatarID } = useContext(ConquerContext)
  const { createRoom } = useContext(ChatContext)

  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedAvatars, setSelectedAvatars] = useState([]);

  useEffect(async () => {
    let avatars = await getAllAvatars();
    setUsers(avatars)
    setLoadingUser(false)
  }, [])

  const onClickUser = (avatarID) => {
    if (selectedAvatars.includes(avatarID)) //remove user
      setSelectedAvatars(prev => {
        var array = [...prev]
        var index = array.indexOf(avatarID)
        if (index !== -1) {
          array.splice(index, 1)
        }
        return array
      });
    else  //add user
      setSelectedAvatars([...selectedAvatars, avatarID])
  }

  const onClickCreateButton = async () => {
    if (!roomName) { alert('Please type the room name'); return; }
    await createRoom(selectedAvatars, roomName)
  }


  return (
    <div className={styles.container}>
      <div className={styles.tokens}>
        <div className={styles.header__title}>
          <p>Create New Room</p>
        </div>
        <div className={styles.header__search}>
          <input
            className={styles.header__input}
            type="text"
            placeholder="Give the room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <p className={styles.header__description}>
          You and {selectedAvatars.length} members in the room
        </p>
        <div className={styles.tokens__list}>
          {loadingUser ?
            <Box sx={{ textAlign: 'center', padding: '20px' }}>
              <CircularProgress />
            </Box> :
            users.map((user, index) => {
              if (user.avatarID != myAvatarID) //don't show me
                return <UserItem key={index}
                  name={user.firstName}
                  state={selectedAvatars.includes(user.avatarID)}
                  photoSrc={user.userPhoto || "/images/content/avatar-1.jpg"}
                  itemClicked={() => onClickUser(user.avatarID)}
                />;
            })
          }
        </div>
        <Button
          variant="contained" color="warning" size="large"
          sx={{ borderRadius: '16px' }}
          disabled={loadingUser}
          onClick={() => onClickCreateButton()}
        >Create Room</Button>
      </div>
    </div>
  );
};

export default NewRoom;
