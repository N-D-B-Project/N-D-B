const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class AvatarCommand extends BaseCommand {
  constructor() {
    super("avatar", "Info", []);
  }

  async run(client, message, args) {
    let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else if (args[0]) {
      user = message.guild.members.cache.get(args[0]).user;
    } else {
      user = message.author;
    }

    let avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
    let Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setImage(avatar)
      .setTitle("Baixar")
      .setURL(avatar)
      .setTimestamp()
      .setFooter(client.user.tag, client.user.displayAvatarURL());
    message.delete().catch((O_o) => {});
    message.channel.send(Embed);
  }
};
