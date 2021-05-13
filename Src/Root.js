require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({ 
  fetchAllMembers: false,
  restTimeOffset: 0,
  shards: "auto",
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', "GUILD_MEMBER"]
});

require('discord-buttons')(client)
const fs = require("fs");

const Registry = require("./Utils/Handlers/CommandHandler");
const { registerEvents } = require("./Utils/Handlers/EventHandler");

const Config = require("./Config/Config.json");
const Tools = require("./Utils/Tools/Tools");
const Logger = require("./Utils/Logger");

const mongoose = require("mongoose");
mongoose.connect(process.env.DBC, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, function(err, db) {
    if(!err) {
      Logger.dtb("MongoDB Conectado!")
    } else if(err) {
      Logger.error("MongoDB Error: \n" + err)
    }
});




(async () => {
    client.login();
    Logger.debug("Hello World!")
    if(!Config.defaultPerms) throw new Error("Você deve definir as defaultPerms para o Client")
    client.defaultPerms = new Discord.Permissions(Config.defaultPerms).freeze();
    client.config = Config;
    client.commands = new Discord.Collection();
    client.events = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.category = new Discord.Collection();
    client.snipe = new Map();
    client.editSnipe = new Map();
    client.Tools = new Tools(client);
    client.Registry = new Registry(client)
    await client.Registry.loadCommands();
    await registerEvents(client, "../../Events"); 
    client.logger = Logger;
    client.owners = Config.owners;
    client.music = require("./Utils/Handlers/ErelaHandler")(client);
})();

process.setMaxListeners(100);
