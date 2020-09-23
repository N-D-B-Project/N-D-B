require("dotenv").config();

const { Client } = require("discord.js");

const {
  registerCommands,
  registerEvents,
} = require("./utils/registry");

const client = new Client();

const mongoose = require("mongoose");

const Config = require("../Config/Config.json");

mongoose.connect(process.env.DBC, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, function(err, db) {
  if(!err) {
    console.log("MongoDB Conectado!")
  } else if(err) {
    console.error("MongoDB Error: " + err)
  }
});


(async () => {
  client.login(process.env.TOKEN);

  client.musicPlayers = new Map();
  client.commands = new Map();
  client.events = new Map();

  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");

  console.log("Hello World!");
})();
