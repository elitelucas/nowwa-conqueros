require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const username = require("username-generator");
const path = require("path");
// const walletController = require('./controllers/wallet');


app.use(express.static("./client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const users = {};

io.on("connection", (socket) => {
  var userid;
  console.log("connected");
  socket.on("myID", (username) => {
    console.log("on myID");
    userid = username;
    users[username] = socket.id;
    console.log(users);
    io.sockets.emit("allUsers", users);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    try {
      delete users[userid];
    } catch (e) {}
    console.log(users);
    io.sockets.emit("allUsers", users);
  });

  socket.on("callUser", (data) => {
    io.to(users[data.userToCall]).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(users[data.to]).emit("callAccepted", data.signal);
  });

  socket.on("close", (data) => {
    io.to(users[data.to]).emit("close");
  });

  socket.on("rejected", (data) => {
    io.to(users[data.to]).emit("rejected");
  });

  socket.on("sendMessage", (data) => {
    console.log("on sendMessage", data.from, "->", data.to, " : ", data.text);
    io.to(users[data.to]).emit("receiveMessage", data);
  });
});

const port = process.env.PORT || 9002;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
