const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class userinfo extends BaseCommand {
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
      .setFooter(`TestBot | Footer`, client.user.displayAvatarURL);

    message.channel.send(uEmbed);
  }
};
