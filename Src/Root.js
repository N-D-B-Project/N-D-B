//@ Client Options
const { Discord, Client, Collection, Permissions } = require("discord.js");
const client = new Client({ disableEveryone: true, partials: ["MESSAGE", "REACTION", "CHANNEL", "USER"]});
//const WOKCommands = require("wokcommands");

//TODO Registry
const {
  registerCommands,
  registerEvents,
  registerMusicEvents,
} = require("./Utils/registryA");
const Registry = require("./Utils/registryMD");

//! Configs
require("dotenv").config();
const Tools = require("./Utils/Tools");
const Config = require("../Config/Config.json");
const Embed = require("../Config/Embed.json");
const Colours = require("../Config/Colours.json");
const Abbreviations = require("../Config/Abbreviations.json");

//# Multi-Language
//const translate = require("@iamtraction/google-translate");
const translate = require("@k3rn31p4nic/google-translate-api");
const LangConfig = require("./Database/Schemas/GuildConfig");
const { loadLanguages } = require("./Features/Language");
const Language = require("./Features/Language");

//% Console Logs
const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
      seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

//$ Database Connection
const mongoose = require("mongoose");

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

(async () => {
  //@ Client Options
  client.login();
  if(!Config.defaultPerms) throw new Error("Você deve definir as defaultPerms para o Client")
  client.defaultPerms = new Permissions(Config.defaultPerms).freeze();
  //client.wok = WOKCommands;
  
  //? Collections
  client.commands = new Collection();
  client.events = new Collection();
  client.aliases = new Collection();

  //* Maps
  client.snipe = new Map();
  client.editSnipe = new Map();

  //! Configs
  client.config = Config;
  client.embed = Embed;
  client.colors = Colours;
  client.ab = Abbreviations;
  client.owners = Config.owners;
  client.testGuilds = Config.testGuilds;
  client.Tools = new Tools(client);

  //# Multi-Language
  client.translate = async (text, message) => {
    let lang;
    const langConfig = await LangConfig.findOne({ guildId: message.guild.id })
    if(langConfig) {
      lang = langConfig.language;
    } else if(!langConfig) {
      lang = "pt";
    }
    const translated = await translate(text, { from: 'pt', to: lang });
    return translated.text;
  }
  client.lang = Language

  //TODO Registry
  // await registerCommands(client, "../Commands");
  await registerEvents(client, "../Events");
  await loadLanguages(client);
  client.Registry = new Registry(client)
  await client.Registry.loadCommands();
  //await client.Registry.loadEvents();
  
  //% Console Logs
  //console.log(" ");
  console.log(date.format(new Date()).grey, "System".cyan, "Debug     ", "Hello World!".magenta,"           INFO".yellow,"   Loaded".green);
})();
