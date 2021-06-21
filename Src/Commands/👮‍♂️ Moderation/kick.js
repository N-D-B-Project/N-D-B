const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class KickCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "kick",
      category: "👮‍♂️ Moderation",
      aliases: ["expulsar"],
      usage: "kick <mencione um usuário>",
      description: "Expulsa o usuário mencionado do servidor",
      userPerms: ["KICK_MEMBERS"],
    });
  }

  async run(client, message, args, tools, prefix) {
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
        var ConfirmEmbed = await message.inlineReply(
          new Discord.MessageEmbed()
            .setTitle(`Expulsão`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setThumbnail(Mention.user.displayAvatarURL())
            .setDescription(
              `${message.author} Você está prestes a Expulsar: ${Mention}!\n 📰Motivo: ${Reason}`
            )
            .addFields(
              {
                name: `Reaja com: ${client.emoji.success}`,
                value: "Para confirmar a Expulsão",
                inline: true,
              },
              {
                name: `Reaja com: ${client.emoji.fail}`,
                value: "Para para cancelar a Expulsão",
                inline: true,
              }
            )
            .setFooter(
              `💡 Dica para expulsar sem ter que confirmar a ação utilize o comando ${prefix}quickkick | ` +
                message.guild.name,
              message.guild.iconURL()
            )
            .setTimestamp()
        );
        ConfirmEmbed.react(client.emoji.success);
        ConfirmEmbed.react(client.emoji.fail);

        const collector = ConfirmEmbed.createReactionCollector(
          (reaction, user) => user.id !== client.user.id,
          {
            time: Timer,
          }
        );

        collector.on("collect", async (reaction, user) => {
          if (user.id !== message.author.id) return;

          const ReactionEmoji =
            reaction.emoji.id || reaction.emoji.name || reaction.emoji;
          switch (ReactionEmoji) {
            case "719560623960096789":
              ConfirmEmbed.reactions.removeAll();
              const BanEmbed = new Discord.MessageEmbed()
                .setTitle(`| Usuário Expulso`)
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setThumbnail(Mention.user.displayAvatarURL())
                .setDescription(
                  `${Mention} quebrou as regras e foi Expulso por ${message.author}\n📰 Motivo: ${Reason}`
                )
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp();
              const MentionEmbed = new Discord.MessageEmbed()
                .setTitle(
                  `| Você foi Expulso do servidor: ${message.guild.name}`
                )
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setThumbnail(Mention.user.displayAvatarURL())
                .setDescription(
                  `Expulso por: ${message.author}\n📰 Motivo: ${Reason}`
                )
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp();
              await Mention.send(MentionEmbed);
              const target = message.guild.members.cache.get(Mention.id);
              target.ban({
                reason: `Expulso por: ${message.author.tag} — 📰 Motivo: ${Reason}`,
                days: days,
              });
              ConfirmEmbed.edit(BanEmbed);
              break;
            case "719560576015138830":
              ConfirmEmbed.reactions.removeAll();
              const CancelEmbed = new Discord.MessageEmbed()
                .setTitle(`Usuário Expulso`)
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setThumbnail(Mention.user.displayAvatarURL())
                .setDescription(
                  `${Mention} não foi Expulso por ${message.author}\n📰 Motivo: Expulsão Cancelada!`
                )
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp();
              ConfirmEmbed.edit(CancelEmbed);
              break;
          }
        });
      }
    }
  }
