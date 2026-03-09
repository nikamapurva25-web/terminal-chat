const io = require("socket.io-client");
const readline = require("readline");
const chalk = require("chalk").default;

const socket = io("https://terminal-chat-730t.onrender.com");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const username = process.argv[2] || "user";

socket.on("connect", () => {
  console.log(chalk.green("Connected to chat server"));
  socket.emit("join", username);
});

socket.on("chat", (msg) => {
  console.log(msg);
});

rl.on("line", (input) => {
  socket.emit("chat", chalk.cyan(username) + ": " + input);
});