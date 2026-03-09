const io = require("socket.io-client");
const readline = require("readline");

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const username = process.argv[2] || "user";

socket.on("chat", (msg) => {
  console.log(msg);
});

rl.on("line", (input) => {
  socket.emit("chat", username + ": " + input);
});