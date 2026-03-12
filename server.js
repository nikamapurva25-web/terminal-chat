const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

let users = {};

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("chat", `🔔 ${username} joined the chat`);
  });

  socket.on("chat", (msg) => {
    // send to everyone INCLUDING sender
    io.emit("chat", msg);
  });

  socket.on("disconnect", () => {
    const name = users[socket.id];
    if (!name) return;
    io.emit("chat", `❌ ${name} left the chat`);
    delete users[socket.id];
  });

});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});