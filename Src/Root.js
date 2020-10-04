require("dotenv").config();

const { Client } = require("discord.js");
const client = new Client({ partials: ["MESSAGE", "REACTION", "CHANNEL"]});
const { Collection } = require('discord.js')

const {
  registerCommands,
  registerEvents,
} = require("./utils/registry")

const colors = require("colors");
const mongoose = require("mongoose");
const Config = require("../Config/Config.json");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
      seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

mongoose.connect(process.env.DBC, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, function(err, db) {
  if(!err) {
    console.log(date.format(new Date()).grey, "System".cyan, "Database  ", "MongoDB Conectado!".magenta,"     INFO".yellow,"   Loaded".green)
  } else if(err) {
    console.error("MongoDB Error: " + err)
  }
});

(async () => {
  client.login(process.env.TOKEN);
  
  client.commands = new Collection();
  client.events = new Collection();
  //client.aliases = new Collection();
  client.musicPlayers = new Collection();
  
  client.musicPlayers = new Map();
  //client.commands = new Map();
  client.events = new Map();
  
  await registerCommands(client, "../Commands");
  await registerEvents(client, "../Events");
  console.log(" ");
  console.log(date.format(new Date()).grey, "System".cyan, "Debug     ", "Hello World!".magenta,"           INFO".yellow,"   Loaded".green);
})();
