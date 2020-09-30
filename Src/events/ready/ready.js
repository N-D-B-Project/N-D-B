require("dotenv").config();

const BaseEvent = require("../../utils/structures/BaseEvent");
const { ErelaClient } = require("erela.js");
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
    console.log(date.format(new Date()).grey, "Client".cyan, client.user.tag + " Esta Online!".magenta);
    console.log(date.format(new Date()).grey, "Client".cyan, `${client.guilds.cache.size}       `, " Servers".magenta);
    console.log(date.format(new Date()).grey, "Client".cyan, `${client.users.cache.size}       `, "Users".magenta);
    console.log(date.format(new Date()).grey, "Client".cyan, `${client.channels.cache.size}       `, "Channels".magenta);
    
    var status = [
      { name: "Best Bot of Discord", type: "LISTENING" },
      { name: "Utilize &help para ver os comandos", type: "WATCHING" },
      { name: `&YT para ver o canal do meu criador`, type: "WATCHING" },
      {
        name: "Terraria",
        type: "STREAMING",
        url: "https://twitch.tv/Nedcloar_BR",
      },
      { name: "Minecraft", type: "PLAYING" },
      { name: "GTA V", type: "PLAYING" },
    ];
    function setStatus() {
      var altstatus = status[Math.floor(Math.random() * status.length)];
      client.user.setPresence({ activity: altstatus });
    }
    setStatus();
    setInterval(() => setStatus(), 5000);

    client.music = new ErelaClient(client, [
      {
        host: process.env.HOST,
        port: process.env.PORT,
        password: process.env.PASSWORD,
      },
    ]);
    
    client.music.on("nodeConnect", (node) =>
      //console.log("Novo Node Conectado")
      console.log(" "),
      console.log(date.format(new Date()).grey, "Music".cyan, " Lavalink  ", "Node Conectado!".magenta)
    );
    client.music.on("nodeError", (node, error) =>
      console.log(`Node error: ${error.message}`)
    );
    client.music.on("trackStart", (player, track) =>
      //player.textChannel.send(`Now playing: ${track.title}`)
      console.log("")
    );
    client.music.on("queueEnd", (player) => {
      //player.textChannel.send("Queue has ended.");
      //client.music.players.destroy(player.guild.id);
    });
  }
};
