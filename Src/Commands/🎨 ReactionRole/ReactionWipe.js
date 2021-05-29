const BaseCommand = require("../../Utils/Structures/BaseCommand");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const Discord = require("discord.js");

const ReactionRole = require("../../Packages/ReactionRole/index.js");
const react = new ReactionRole();

module.exports = class ReactionWipeCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "reactionwipe",
      aliases: ["reactionrolewipe", "reactionroleswipe", "rrwipe"],
      description: "Remove todas as Reaction Roles do Servidor",
      category: "🎨 ReactionRole",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(client, message, args) {
    const conditional = {
      guildId: message.guild.id,
    };
    const results = await ReactionRole.find(conditional);

    if (results && results.length) {
      for (const result of results) {
        const { guildId } = result;

        try {
          await ReactionRole.deleteOne(conditional);
        } catch (e) {
          console.log(e);
        }
      }
    }

    let resultsHeheLol = results.length;
    let resultsHehe = `Reaction Roles`;
    if (resultsHeheLol == "1") resultsHehe = "Reaction Role";

    if (resultsHeheLol === "0" || !results || !results.length) {
      let wipeEmbed3 = new Discord.MessageEmbed()
        .setColor("#00c26f")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`O Servidor não possui nenhuma Reaction Role`);

      message.channel.send(wipeEmbed3);

      return;
    }

    let wipeEmbed = new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `Toda(s) a(s): **${results.length}** ${resultsHehe} foram apagadas com sucesso!`
      );

    message.channel.send(wipeEmbed);
  }
};
