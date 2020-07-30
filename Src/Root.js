require("dotenv").config();

const { Client } = require("discord.js");
const { ErelaClient } = require("erela.js");

const {
  registerCommands,
  registerEvents,
  registerMusicEvents,
} = require("./utils/registry");

const client = new Client();

const mongoose = require("mongoose");

const Config = require("../Config/Config.json");

mongoose.connect("mongodb://localhost/NDBase", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  client.login(process.env.DISCORD_BOT_TOKEN);
  client.music = new ErelaClient(client, [
    {
      host: process.env.HOST,
      port: process.env.PORT,
      password: process.env.PASSWORD,
    },
  ]);
  client.commands = new Map();
  client.events = new Map();
  // client.prefix = Config.prefix;

  await registerMusicEvents(client.music, "../musicevents");
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");

  console.log("Hello World!");
})();
