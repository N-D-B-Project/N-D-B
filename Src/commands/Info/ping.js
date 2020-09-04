const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super("ping", "Info", []);
  }

  async run(client, message, args) {
    let embed1 = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle("Ping?")
      .setColor("RANDOM")
      .setFooter("ping", client.user.displayAvatarURL);
    const ms = await message.channel.send(embed1);

    let embed2 = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle("Pong?")
      .setColor("RANDOM")
      .setDescription(
        `📡 The Latency is ${Math.floor(
          message.createdTimestamp - message.createdTimestamp
        )}ms.\n🖥 The API Latency is ${client.ws.ping}ms.`
      )
      .setFooter("ping", client.user.displayAvatarURL);
    ms.edit(embed2);
  }
};
