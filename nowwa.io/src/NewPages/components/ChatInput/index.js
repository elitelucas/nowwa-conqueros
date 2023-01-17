import React from "react";
import ChatCustomInput from "../ChatCustomInput";
import ChatInputState from "../ChatInputState";
import { IconButton } from "@mui/material";
import styles from "./ChatInput.module.sass";

const ChatInput = (props) => {
  return (
    <>
      {/* typing status */}
      {/* <ChatInputState />  */}
      {/*  */}
      <ChatCustomInput sendMessage={props.sendMessage} />
    </>
  );
};

export default ChatInput;
