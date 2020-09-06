const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class ServersCommand extends BaseCommand {
  constructor() {
    super("faltaquanto", "Moderation", []);
  }

  async run(client, message, args) {
    var sv = `${client.guilds.cache.size}`;
    var precisa = 75;
    let resta = precisa - sv;
    const quanto = `Estou em ${client.guilds.cache.size} Servers`;
    const falta = `Preciso estar em mais ${resta} para ser verificado`;
    const embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.avatarURL)
      .setTitle("**__Verificação__**")
      .addField(quanto, "✅")
      .addField(falta, "❔")
      .setColor(`#00c26f`)
      .setTimestamp();
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
