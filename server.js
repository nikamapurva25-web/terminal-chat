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
let messages = [];

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = { name: username, status: "online" };
    io.emit("chat", `🔔 ${username} joined the chat`);
  });

  socket.on("chat", (msg) => {
    messages.push(msg);
    if (messages.length > 100) messages.shift();
    socket.broadcast.emit("chat", msg);
  });

  socket.on("edit", (newMsg) => {
    const user = users[socket.id].name;
    io.emit("chat", `✏️ ${user} edited message: ${newMsg}`);
  });

  socket.on("delete", () => {
    const user = users[socket.id].name;
    io.emit("chat", `🗑️ ${user} deleted a message`);
  });

  socket.on("status", (status) => {
    users[socket.id].status = status;
    io.emit("chat", `📢 ${users[socket.id].name} is now ${status}`);
  });

  socket.on("nick", (newName) => {
    const old = users[socket.id].name;
    users[socket.id].name = newName;
    io.emit("chat", `🔄 ${old} is now ${newName}`);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("chat", `❌ ${users[socket.id].name} left the chat`);
      delete users[socket.id];
    }
  });

});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});