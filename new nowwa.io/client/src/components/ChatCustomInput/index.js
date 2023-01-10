import React, { useEffect, useState, useRef } from "react";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicNoneIcon from "@mui/icons-material/MicNone";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from "./ChatCustomInput.module.sass";
import emojis from "./emoji.json"

const ChatCustomInput = (props) => {
  const [inputText, setInputText] = useState("");
  const [showEmojiBox, setShowEmojiBox] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("on Enterkey", inputText);
      doSendMessage();
    }
  };

  const handleSendButton = () => {
    doSendMessage();
  }

  const doSendMessage = () => {
    props.sendMessage(inputText);
    setInputText("")
    setShowEmojiBox(false)
  }

  const handleClickOneEmoji = (emoji) => {
    setInputText(inputText + emoji)
  };

  const handleEmojiButton = () => {
    setShowEmojiBox((prev) => {
      return !prev;
    });
  };

  return (
    <>
      {showEmojiBox &&
        <div className={styles.emoji_container}>
          <div className={styles.grid_container} >
            {emojis.map((emoji) => {
              return (
                <div
                  className={styles.grid_item}
                  onClick={() => handleClickOneEmoji(emoji)}
                >
                  {emoji}
                </div>
              );
            })}
          </div>
        </div>
      }

      <div className={styles.container}>
        <div className={styles.container__inputLeft}>
          <input
            className={styles.input}
            type="text"
            name="message"
            value={inputText}
            placeholder="Start typing..."
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div className={styles.container__inputRight}>
          <IconButton aria-label="emoj" onClick={handleEmojiButton}>
            {showEmojiBox ?
              <ExpandMoreIcon className={styles.container__inputRight__emoj} /> :
              <InsertEmoticonIcon className={styles.container__inputRight__emoj} />
            }

          </IconButton>

          <IconButton aria-label="mic">
            <MicNoneIcon className={styles.container__inputRight__mic} />
          </IconButton>

          <IconButton aria-label="attach" style={{ marginRight: "20px" }}>
            <AttachFileIcon className={styles.container__inputRight__attach} />
          </IconButton>

          <IconButton aria-label="send" onClick={handleSendButton}>
            <SendIcon className={styles.container__inputRight__send} />
          </IconButton>
        </div>
      </div>
    </>

  );
};

export default ChatCustomInput;
