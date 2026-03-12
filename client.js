#!/usr/bin/env node

const io = require("socket.io-client");
const readline = require("readline");
const chalk = require("chalk");

const socket = io("https://terminal-chat-730t.onrender.com", {
  transports: ["websocket"],
  reconnection: true
});

let username = process.argv[2] || "user";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt(chalk.cyan(username) + " > ");
rl.prompt();

socket.on("connect", () => {
  console.log(chalk.green("✅ Connected to chat server"));
  socket.emit("join", username);
});

socket.on("chat", (msg) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
});

socket.on("disconnect", () => {
  console.log("⚠️ Disconnected... reconnecting");
});

rl.on("line", (input) => {
  const message = chalk.cyan(username) + ": " + input;
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(message);
  socket.emit("chat", message);
  rl.prompt();
});