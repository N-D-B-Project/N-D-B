const BaseCommand = require("../../Utils/Structures/BaseCommand");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const Discord = require("discord.js");

const ReactionRole = require("../../Packages/ReactionRole/index.js");
const react = new ReactionRole();

module.exports = class EditReactionRoleCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "editreaction",
      aliases: ["editreactionrole", "err"],
      description: "Edita uma Reaction Role",
      category: "🎨 ReactionRole",
      usage: "<Canal> <MessageID> <Novo Cargo> <Emoji> (option)",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });

    const prefix = guildConfig.prefix || "&";

    let properUsage = new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setDescription(
        `__**Modo de Usar**__\n\n\`\` ${prefix}editreaction <Canal> <MessageID> <Cargo> <Emoji> (option)`
      )

    if (args.length < 1) {
      return message.channel.send(properUsage);
    }

    let fail = client.emoji.fail;
    let success = client.emoji.success;

    let option = args[4];
    if (!option) option = 1;
    if (isNaN(option)) option = 1;
    if (option > 6) option = 1;

    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.guild.channels.cache.find((ch) => ch.name === args[0]);
    if (!channel)
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Canal invalido`)
          .setColor("#00c26f")
      );

    let ID = args[1];
    if (!ID)
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} MessageId invalido`)
      );
    let messageID = await channel.messages.fetch(ID).catch(() => {
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Não consigo encontrar esse ID`)
          .setColor("#00c26f")
      );
    });

    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((rl) => rl.name === args[2]);
    if (!role)
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Cargo invalido`)
          .setColor("#00c26f")
      );

    if (role.managed) {
      return message.channel.send(
        `${client.emojis.fail} Não utilize cargos de integrações`
      );
    }

    let emoji = args[3];

    if (isCustomEmoji(args[3]))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Não utilize emojis personalizados`)
          .setColor("#00c26f")
      );

    if (!emoji)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`${fail} Emoji invalido`)
          .setColor("#00c26f")
      );

    await react.reactionEdit(client, message.guild.id, ID, role.id, emoji);

    message.channel.send(
      new Discord.MessageEmbed()
        .setAuthor(
          "Reaction Role Editada",
          message.guild.iconURL(),
          messageID.url
        )
        .setColor("#00c26f")
        .addField("Canal", channel, true)
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
