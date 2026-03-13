const io = require("socket.io-client");
const readline = require("readline");

const socket = io("https://terminal-chat-730t.onrender.com");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Username: ", (username) => {

  socket.emit("join", username);

  rl.on("line", (input) => {
    if (input.trim() !== "") {
      socket.emit("message", input);
    }
  });

});

socket.on("message", (data) => {
  console.log(`${data.user}: ${data.text}`);
});