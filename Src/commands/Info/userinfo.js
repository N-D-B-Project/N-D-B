const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class UserInfoCommand extends BaseCommand {
  constructor() {
    super("userinfo", "Info", []);
  }

  async run(client, message, args) {
    let uEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("User Info")
      .setThumbnail(message.guild.iconURL)
      .setAuthor(
        `${message.author.username} Info`,
        message.author.displayAvatarURL
      )
      .addField("**Username:**", `${message.author.username}`, true)
      .addField("**Discriminator:**", `${message.author.discriminator}`, true)
      .addField("**ID:**", `${message.author.id}`, true)
      .addField("**Status:**", `${message.author.presence.status}`, true)
      .addField("**Created At:**", `${message.author.createdAt}`, true)
      .setFooter("N-D-B", client.user.displayAvatarURL);
    message.delete().catch((O_o) => {});
    message.channel.send(uEmbed);
  }
};
