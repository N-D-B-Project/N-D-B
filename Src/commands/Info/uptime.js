const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class UptimeCommand extends BaseCommand {
  constructor() {
    super("uptime", "Info", []);
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

    message.channel.send(embed);
  }
};
