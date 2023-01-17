require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const path = require("path");
// const walletController = require('./controllers/wallet');

app.use(express.static(path.resolve(__dirname, "storage")));

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve("storage", "index.html"));
});

const port = process.env.PORT || 9002;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
