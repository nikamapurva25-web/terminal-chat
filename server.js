const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const io = new Server(PORT, {
  cors: { origin: "*" }
});

let users = {};

console.log("Chat server running");

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("chat", `🔔 ${username} joined the chat`);
  });

  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("chat", `❌ ${username} left the chat`);
      delete users[socket.id];
    }
  });

});