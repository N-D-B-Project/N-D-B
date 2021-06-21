const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class QuickKickCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "quickban",
      category: "👮‍♂️ Moderation",
      aliases: ["banirrapido"],
      usage: "quickban <mencione um usuário> [motivo]",
      description: "Bane o usuário mencionado do servidor",
      userPerms: ["KICK_MEMBERS"],
    });
  }

  async run(client, message, args, tools, prefix) {
    try {
      const Timer = 120000;
      const Mention =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          (x) =>
            x.user.username.toLowerCase() === args.slice(0).join(" ") ||
            x.user.username === args[0]
        );
      if (!Mention) {
        message.inlineReply("Mencione quem você quer expulsar");
      } else {
        const KickEmbed = new Discord.MessageEmbed()
          .setTitle(`Usuário Expulso`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setThumbnail(Mention.user.displayAvatarURL())
          .setDescription(
            `${Mention} quebrou as regras e foi Expulso por ${message.author}\n📰 Motivo: ${Reason}`
          )
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();
        const MentionEmbed = new Discord.MessageEmbed()
          .setTitle(
            `Você foi Expulso do servidor: ${message.guild.name}`
          )
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setThumbnail(Mention.user.displayAvatarURL())
          .setDescription(
            `Expulso por: ${message.author}\n📰 Motivo: ${Reason}`
          )
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();
        await Mention.send(MentionEmbed);
        const target = message.guild.members.cache.get(Mention.id);
        target.kick({
          reason: `Expulso por: ${message.author.tag} — 📰 Motivo: ${Reason}`,
        });
        ConfirmEmbed.edit(KickEmbed);
      }
    } catch (error) {
      if (error) {
        ConfirmEmbed.edit(
          new Discord.MessageEmbed()
            .setColor("#00c26f")
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setTitle("ERR0R")
            .setDescription(
              "Algum erro ocorreu e não consegui executar este comando corretamente 😥"
            )
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
        );
      }
    }
  }
};
