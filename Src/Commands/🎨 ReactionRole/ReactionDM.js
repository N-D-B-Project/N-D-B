const BaseCommand = require("../../Utils/Structures/BaseCommand");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const Discord = require("discord.js");

const ReactionRole = require("../../Packages/ReactionRole/index.js");
const react = new ReactionRole();

module.exports = class ReactionRoleDMsCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "reactiondm",
      aliases: ["reactionrolesdm", "rrdirectmessages", "rrdm"],
      description: "Ativa / Desativa Reaction Role DMs",
      category: "🎨 ReactionRole",
      usage: "on / off",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });

    let fail = client.emoji.fail;
    let success = client.emoji.success;
    const prefix = guildConfig.prefix || "&";

    let properUsage = new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setDescription(
        `__**Modo de Usar**__\n\n\`1-\` ${prefix}reactiondm on\n\`2-\` ${prefix}reactiondm off`
      )

    if (args.length < 1) {
      return message.channel.send(properUsage);
    }

    if (args.includes("off")) {
      await GuildConfig.findOne(
        {
          guildId: message.guild.id,
        },
        async (err, guild) => {
          if (guild.reactionDM === false)
            return message.channel.send(
              new Discord.MessageEmbed()
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setDescription(`${fail} DMs já está Desabilitado`)
                .setColor("#00c26f")
            );
          guild
            .updateOne({
              reactionDM: false,
            })
            .catch((err) => console.error(err));

          message.channel.send(
            new Discord.MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setDescription(
                `${success} Reaction Role DMs Desabilitado!`
              )
              .setColor("#00c26f")
          );
        }
      );
    } else if (args.includes("on")) {
      await GuildConfig.findOne(
        {
          guildId: message.guild.id,
        },
        async (err, guild) => {
          if (guild.reactionDM === true)
            return message.channel.send(
              new Discord.MessageEmbed()
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setDescription(`${fail} DMs já está Ativado!`)

                .setColor("#00c26f")
            );
          guild
            .updateOne({
              reactionDM: true,
            })
            .catch((err) => console.error(err));

          message.channel.send(
            new Discord.MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setDescription(`${success} Reaction Role DMs foi Ativado!`)
              .setColor("#00c26f")
          );
        }
      );
    } else if (args[0]) {
      message.channel.send(properUsage);
    } else {
      message.channel.send(properUsage);
    }
  }
};
