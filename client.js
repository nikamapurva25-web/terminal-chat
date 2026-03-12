#!/usr/bin/env node

const io = require("socket.io-client");
const readline = require("readline");
const chalk = require("chalk");

const socket = io("https://terminal-chat-730t.onrender.com");

const username = process.argv[2] || "user";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt() {
  rl.setPrompt(chalk.cyan(username) + " > ");
  rl.prompt();
}

socket.on("connect", () => {
  console.log("✅ Connected");
  socket.emit("join", username);
  prompt();
});

socket.on("chat", (msg) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);

  console.log(msg);

  prompt();
});

rl.on("line", (input) => {
  const msg = `${username}: ${input}`;
  socket.emit("chat", msg);
});