require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const Tools = require("../Utils/Tools/Tools");
const Logger = require("../Utils/Tools/Logger");
const CommandHandler = require("../Utils/Handlers/CommandHandler");
const EventHandler = require("../Utils/Handlers/EventHandler");
const ReactionRole = require("../Packages/ReactionRole/index.js");

module.exports = class NDBClient extends Discord.Client {
  constructor(options = {}, sentry) {
    super({
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: true,
      cachePresences: true,
      fetchAllMembers: true,
      messageCacheMaxSize: 25,
      messageCacheLifetime: 10000,
      messageSweepInterval: 12000,
      restTimeOffset: 0,
      shards: "auto",
      restWsBridgetimeout: 100,
      allowedMentions: { parse: ["users", "roles"] },
      partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
      ws: {
        intents: [
          "GUILDS",
          "GUILD_MEMBERS",
          "GUILD_MESSAGES",
          "GUILD_EMOJIS",
          "GUILD_MESSAGE_REACTIONS",
        ],
      },
    });

    this.validate(options);
    this.CommandHandler = new CommandHandler(this);
    this.EventHandler = new EventHandler(this);
    this.music = require("../Utils/Handlers/ErelaHandler")(this);
    this.defaultPerms = new Discord.Permissions(options.defaultPerms).freeze();
    this.partials = ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"];
    this.config = options;
    this.commands = new Discord.Collection();
    this.events = new Discord.Collection();
    this.aliases = new Discord.Collection();
    this.snipe = new Map();
    this.editSnipe = new Map();
    this.react = new Map();
    this.Tools = new Tools(this);
    this.logger = Logger;
    this.owners = options.owners;
  }

  validate(options) {
    if (typeof options !== "object")
      throw new TypeError("Options deve ser um tipo de objeto.");

    if (!process.env.DISCORD_TOKEN)
      throw new Error("Você deve definir um Token para o Client.");
    this.token = process.env.DISCORD_TOKEN;

    if (!process.env.DBC)
      throw new Error("Você deve definir o link do MongoDB para o Client.");
    this.dbc = process.env.DBC;
  }

  async start(token = this.token) {
    this.CommandHandler.loadCommands();
    this.EventHandler.loadEvents();
    
    const connect = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.connect(this.dbc, connect, function (err, db) {
      if (!err) {
        Logger.dtb("Client: MongoDB Conectado!");
      } else if (err) {
        Logger.error("MongoDB Error: \n" + err);
      }
    });

    const react = new ReactionRole()

    react.setURL(process.env.DBC)

    super.login((token = this.token));
    Logger.debug("Hello World");
  }
};
