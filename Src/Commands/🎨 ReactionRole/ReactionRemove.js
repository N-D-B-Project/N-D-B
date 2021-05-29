const BaseCommand = require("../../Utils/Structures/BaseCommand");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const Discord = require("discord.js");

const ReactionRole = require("../../Packages/ReactionRole/index.js");
const react = new ReactionRole();

module.exports = class ReactionRemoveCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "reactionremove",
      aliases: [
        "removereactionrole",
        "rreactionrole",
        "deletereactionrole",
        "delreactionrole",
        "remrr",
        "delrr",
        "delreaction",
        "deletereaction",
      ],
      description: "Remove uma Reaction Role",
      category: "🎨 ReactionRole",
      usage: "<Canal> <MessageID> <Emoji>",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(client, message, args) {

    let properUsage = new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setDescription(
        `__**Modo de Usar**__\n\n\`\` ${prefix}reactionremove <Canal> <MessageID> <Emoji>`
      )

    if (args.length < 1) {
      return message.channel.send(properUsage);
    }

    let fail = client.emoji.fail;
    let success = client.emoji.success;

    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.guild.channels.cache.find((ch) => ch.name === args[0]);
    if (!channel)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Canal invalido`)
          .setColor("#00c26f")
      );

    let ID = args[1];
    if (!ID)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} MessageID invalido`)
      );
    let messageID = await channel.messages.fetch(ID).catch(() => {
      return message.channel.send(
        new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`${fail} MessageID não encontrado`)
        .setColor("#00c26f")
      );
    });

    let emoji = args[2];

    if (!emoji)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Emoji invalido`)
          .setColor("#00c26f")
      );

    if (isCustomEmoji(args[2]))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Não utilize emojis personalizados`)
          .setColor("#00c26f")
      );

    await react.reactionDelete(client, message.guild.id, ID, emoji);

    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#00c26f")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(
          `${success} Reaction Role [Removida](${messageID.url})`
        )
    );

    function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }
  }
};
