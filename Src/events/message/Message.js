const BaseEvent = require("../../utils/structures/BaseEvent");
const GuildConfig = require("../../database/schemas/GuildConfig");
const mongoose = require("mongoose");
const Config = require("../../../Config/Config.json");
const formatArray = require("../../Tools/formatArray");
const formatPerms = require("../../Tools/formatPerms");
//const checkOwner = require("../../Tools/checkOwner");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(client, message, guild) {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;

    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });
    if (!guildConfig) {
      await new GuildConfig({
        guildName: message.guild.name,
        guildId: message.guild.id,
        prefix: "&",
      }).save();
      console.log(`Server: ${message.guild.name} Salvo na DataBase!`);
    }

    const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);

    const Prefix = guildConfig.get("prefix") || mentionRegexPrefix;
    const FindPrefix = guildConfig.prefix;
    const prefix = message.content.match(mentionRegexPrefix) ?
      message.content.match(mentionRegexPrefix)[0] : Prefix;
    client.prefix = prefix;

    if(!message.content.startsWith(prefix)) return;

    if(message.content.match(mentionRegex)) message.channel.send(`Meu Prefix para \`${message.guild.name}\` é: ${FindPrefix}`);

    if(message.content.startsWith(prefix)) {
      const [ cmd, ...args ] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));

      if(command) {
        if (command.ownerOnly && !client.Tools.checkOwner(message.author.id)) {
          return message.reply("Comando restrito para o Dono do Bot");
        }

        if(command.guildOnly && !message.guild) {
          return message.reply("Comando Restrito para outro Servidor");
        }

        if(command.nsfw && !message.channel.nsfw) {
          return message.reply(
            "Esse Comando só pode ser executado em canais NSFW"
          );
        }

        if(command.args && !args.length) {
          return message.reply(
            "Esse comando precisa de mais Args para funcionar"
          );
        }

        if (message.guild) {
          const userPermCheck = command.userPerms
            ? client.defaultPerms.add(command.userPerms)
            : client.defaultPerms;
          if (userPermCheck) {
            const missing = message.channel
              .permissionsFor(message.member)
              .missing(userPermCheck);
            if (missing.length) {
              return message.reply(
                `You are missing ${formatArray(
                  missing.map(formatPerms)
                )} permissions, you need them to use this command!`
              );
            }
          }

          const botPermCheck = command.botPerms
            ? client.defaultPerms.add(command.botPerms)
            : client.defaultPerms;
          if (botPermCheck) {
            const missing = message.channel
              .permissionsFor(message.member)
              .missing(botPermCheck);
            if (missing.length) {
              return message.reply(
                `Faltam as seguintes Permissões: ${formatArray(
                  missing.map(formatPerms)
                )} Para executar esse Comando!`
              );
            }
          }
        }
        
        command.run(client, message, args);
      }
    }
  }
};
