#!/usr/bin/env node

const io = require("socket.io-client");
const readline = require("readline");
const chalk = require("chalk");

const socket = io("https://terminal-chat-730t.onrender.com", {
  transports: ["websocket"],
  reconnection: true
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let username = process.argv[2] || "user";
let lastSent = "";

socket.on("connect", () => {
  console.log(chalk.green("Connected to chat server"));
  socket.emit("join", username);
});

socket.on("chat", (msg) => {

  // ignore your own message coming back from server
  if (msg === lastSent) return;

  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
});

socket.on("disconnect", () => {
  console.log("⚠️ Disconnected... reconnecting");
});

rl.setPrompt("");
rl.prompt();

rl.on("line", (input) => {

  const message = chalk.cyan(username) + ": " + input;

  lastSent = message;

  socket.emit("chat", message);
});