require("dotenv").config();

const BaseEvent = require("../../utils/structures/BaseEvent");
const { Manager } = require("erela.js");
const Spotify  = require("erela.js-spotify");

const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client) {
    console.log(date.format(new Date()).grey, "Client".cyan, client.user.tag + " Esta Online!".magenta,"           INFO".yellow,"   Loaded".green);
    console.log(date.format(new Date()).grey, "Client".cyan, `${client.guilds.cache.size}       `, " Servers".magenta,"                INFO".yellow,"   Loaded".green);
    //console.log(date.format(new Date()).grey, "Client".cyan, `${client.users.cache.size}       `, "Users".magenta,"                  INFO".yellow,"   Loaded".green);
    console.log(date.format(new Date()).grey, "Client".cyan, `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`, "      Users".magenta,"                  INFO".yellow,"   Loaded".green);
    console.log(date.format(new Date()).grey, "Client".cyan, `${client.channels.cache.size}       `, "Channels".magenta,"               INFO".yellow,"   Loaded".green);
    
    function setStatus() {
      const AStatus = client.Tools.Status[Math.floor(Math.random() * client.Tools.Status.length)];
      client.user.setPresence({ activity: AStatus });
    }
    setStatus();
    setInterval(() => setStatus(), 5000);

    const clientID = process.env.SpotifyID;
    const clientSecret = process.env.SpotifySecret;

    client.music = new Manager({
      plugins: [ new Spotify({ clientID, clientSecret }) ],
      nodes: [
        {
          host: process.env.HOST,
          port: 7000 || process.env.PORT,
          password: process.env.PASSWORD,
        },
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if(guild) guild.shard.send(payload);
      },
    })
    
    client.music.on("nodeConnect", (node) =>
      //console.log("Novo Node Conectado")
      console.log(" "),
      console.log(date.format(new Date()).grey, "Music".cyan, " Lavalink  ", "Node Conectado!".magenta,"        INFO".yellow,"   Loaded".green)
    );
    client.music.on("nodeError", (node, error) =>      
      console.error(date.format(new Date()).grey, "Music".cyan, " Lavalink  ", "Node Error!".magenta,"            INFO".yellow,"   Not Loaded".red + `\n ${error}`),
    );
    client.music.on("trackStart", (player, track) =>
      //player.textChannel.send(`Now playing: ${track.title}`)
      console.log("")
    );
    client.music.on("queueEnd", (player) => {
      //player.textChannel.send("Queue has ended.");
      //client.music.players.destroy(player.guild.id);
    });
    client.music.init(client.user.id);
    
    client.on("raw", (d) => client.music.updateVoiceState(d));
    // console.log(date.format(new Date()).grey, `${client.commands.size}`.cyan,"    Commands", "  Carregando...".magenta,"          INFO".yellow,   "   Loaded".green)
    // console.log(date.format(new Date()).grey, `${client.events.size}`.cyan, "     Events  ", "  Carregando...".magenta,"          INFO".yellow,   "   Loaded".green)
  
    const messagesPath = 'messages.json';
    const dbOptions = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }

    new client.wok(client, {
      commandsDir: 'Commands',
      featureDir: 'Features',
      messagesPath,
      showWarns: false,
      dbOptions
    })
    .setMongoPath(process.env.DBC)
    .setDefaultPrefix("&")
    .setColor("#00c26f");
  
  }
};
