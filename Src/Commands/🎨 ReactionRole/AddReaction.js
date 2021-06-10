const BaseCommand = require("../../Utils/Structures/BaseCommand");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const Discord = require("discord.js");
const ReactionRole = require("../../Packages/ReactionRole/index.js");
const react = new ReactionRole();

module.exports = class AddReactionCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "addreaction",
      aliases: [
        "reactionrole",
        "rr",
        "createrr",
        "crr",
        "addrr",
        "arr",
        "rradd",
      ],
      description: "Cria uma Reaction Role",
      category: "🎨 ReactionRole",
      usage: "<Canal> <MessageID> <Cargo> <Emoji> (option)",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })

    const prefix = guildConfig.prefix || "&";

    let properUsage = new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setDescription(
        `__**Modo de Usar**__\n\n\`\` ${prefix}addreaction <Canal> <MessageID> <Cargo> <Emoji> (option)`
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
          .setFooter(``)
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

    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((rl) => rl.name === args[2]);
    if (!role)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Cargo Invalido`)
          .setColor("#00c26f")
      );

    if (role.managed) {
      return message.channel.send(
        `${message.client.emoji.fail} Não utilize cargos de integrações`
      );
    }

    let emoji = args[3];

    if (!emoji)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Emoji invalido`)
          .setColor("#00c26f")
      );

    if (isCustomEmoji(args[3]))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Não utilize emojis personalizados`)
          .setColor("#00c26f")
      );

    try {
      await messageID.react(emoji);
    } catch (err) {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Emoji invalido`)
          .setColor("#00c26f")
      );
    }

    let option = args[4];
    if (!option) option = 1;
    if (isNaN(option)) option = 1;
    if (option > 6) option = 1;

    await react.reactionCreate(
      client,
      message.guild.id,
      ID,
      role.id,
      emoji,
      "false",
      option
    );

    message.channel.send(
      new Discord.MessageEmbed()
        .setAuthor("Reaction Roles", message.guild.iconURL(), messageID.url)
        .setColor("#00c26f")
        .addField("Channel", channel, true)
        .addField("Emoji", emoji, true)
        .addField("Tipo", option, true)
        .addField("MessageID", ID, true)
        .addField("Mensagem", `[Clique aqui](${messageID.url})`, true)
        .addField("Role", role, true)
    );

    function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }
  }
};
