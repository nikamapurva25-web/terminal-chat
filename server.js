const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const io = new Server(PORT, {
  cors: {
    origin: "*"
  }
});

console.log("Server running on port " + PORT);

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    socket.username = username;

    io.emit("message", {
      user: "SYSTEM",
      text: username + " joined the chat"
    });
  });

  socket.on("message", (msg) => {

    io.emit("message", {
      user: socket.username,
      text: msg
    });

  });

});