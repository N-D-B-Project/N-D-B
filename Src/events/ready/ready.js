const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client) {
    console.log(client.user.tag + " has logged in.");
    console.log(
      `Estou em ${client.users.cache.size} Users, In ${client.channels.cache.size} Channels and ${client.guilds.cache.size} Servers!`
    );
    var status = [
      { name: "Best Bot of Discord", type: "LISTENING" },
      { name: "Utilize n!help para ver os comandos", type: "WATCHING" },
      { name: "n!YT para ver o canal do meu criador", type: "WATCHING" },
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
  }
};
