require("dotenv").config();

const { Client, Collection, Permissions } = require("discord.js");
const client = new Client({ disableEveryone: true, partials: ["MESSAGE", "REACTION", "CHANNEL", "USER"]});
const WOKCommands = require("wokcommands");

const { loadLanguages } = require("./utils/Language");
const {
  registerCommands,
  registerEvents,
} = require("./utils/registryA");
const Registry = require("./utils/registryMD");
const Tools = require("./utils/Tools");

const colors = require("colors");
const mongoose = require("mongoose");
const Config = require("../Config/Config.json");
const Colours = require("../Config/Colours.json");

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
    console.error(date.format(new Date()).grey, "System".cyan, "Database  ", "MongoDB Error     ".magenta,"     INFO".yellow,"   Not Loaded".red)
    console.error("MongoDB Error: \n" + err)
  }
});

if(!Config.defaultPerms) throw new Error("Você deve definir as defaultPerms para o Client")
client.defaultPerms = new Permissions(Config.defaultPerms).freeze();

(async () => {
  client.login(process.env.TOKEN);
  client.wok = WOKCommands;
  
  client.commands = new Collection();
  client.events = new Collection();
  client.aliases = new Collection();
  
  client.snipe = new Map();
  client.colors = Colours;
  client.config = Config;
  client.owners = Config.owners;
  client.testGuild = Config.testGuild;
  client.Tools = new Tools(client);
  
  //await registerCommands(client, "../Commands");
  await registerEvents(client, "../Events");
  await loadLanguages(client);

  client.Registry = new Registry(client)
  await client.Registry.loadCommands();
  //await client.Registry.loadEvents();
  
  //console.log(" ");
  console.log(date.format(new Date()).grey, "System".cyan, "Debug     ", "Hello World!".magenta,"           INFO".yellow,"   Loaded".green);
})();
