const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: { origin: "*" }
});

console.log("Chat server running on port 3000");

io.on("connection", (socket) => {

  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });

});