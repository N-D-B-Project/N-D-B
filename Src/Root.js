require("dotenv").config();

const { Client } = require("discord.js");
const colors = require("colors");

const {
  registerCommands,
  registerEvents,
} = require("./utils/registry");

const client = new Client({ partials: ["MESSAGE", "REACTION", "CHANNEL"]});

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
    console.log(date.format(new Date()).grey, "System".cyan, "Database  ", "MongoDB Conectado!".magenta)
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
  console.log(" ");
  console.log(date.format(new Date()).grey, "System".cyan, "Debug     ", "Hello World!".magenta);
})();
