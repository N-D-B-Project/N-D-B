const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class UptimeCommand extends BaseCommand {
  constructor() {
    super(
      'uptime', //name
      'Info', //category
      [''], //aliases
      '', //usage
      'Mostra quanto tempo o Bot está Online' //description
    );
  }

  async run(client, message, args) {
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let uptime = `\n> 📅 ${days} Dias \n> ⌚ ${hours} Horas \n> 🕐 ${minutes} Minutos \n> ⏳ ${seconds} Segundos`;

    const embed = new Discord.MessageEmbed()
      .setTitle("N-D-B Bot Uptime")
      .setColor("RANDOM")
      .setDescription(`${uptime}`);
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
