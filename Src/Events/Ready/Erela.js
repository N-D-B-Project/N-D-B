require("dotenv").config();

const BaseEvent = require("../../Utils/Structures/BaseEvent");
const { Manager } = require("erela.js");
const Spotify  = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");

const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

const {
  registerMusicEvents,
} = require("../../Utils/registryA");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client) {
    const clientID = process.env.SpotifyID;
    const clientSecret = process.env.SpotifySecret;

    client.music = new Manager({
      plugins: [ 
        new Spotify({ clientID, clientSecret })//,
        //new Deezer() 
      ],
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

    await registerMusicEvents(client.music, "../Events/Music")
    
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
      //player.textChannel.send("Fila de musicas acabou!");
      //client.music.players.destroy(player.guild.id);
    });
    client.music.init(client.user.id);
    
    client.on("raw", (d) => client.music.updateVoiceState(d));

  }
};
