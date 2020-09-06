const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class VoteCommand extends BaseCommand {
  constructor() {
    super("vote", "Moderation", ["votar"]);
  }

  async run(client, message, args) {
    let quest = args.join(" ");

    let Emoji = [
      "<a:Accept:719710630881525881> - Para concordar",
      "<a:Denied:719710607405875321> - Para discordar",
    ];

    let Embed = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ size: 4096, dynamic: true })
      )
      .setTitle(`Iniciou uma votação:`)
      .setDescription(quest)
      .setColor("#00c26f")
      .addFields({ name: "Como votar:", value: Emoji })
      .setTimestamp()
      .setFooter(client.user.tag, client.user.displayAvatarURL());

    message.delete().catch((O_o) => {});
    message.channel.send(Embed).then((sentEmbed) => {
      sentEmbed.react("719710630881525881");
      sentEmbed.react("730729650296193044");
    });
  }
};
