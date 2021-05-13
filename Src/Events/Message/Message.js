const BaseEvent = require("../../Utils/Structures/BaseEvent");
const GuildConfig = require("../../Database/Schemas/GuildConfig");
const GuildConfigRoles = require('../../Database/Schemas/GuildRoles');
const GuildConfigChannels = require('../../Database/Schemas/GuildChannel');
const mongoose = require("mongoose");
const Config = require("../../Config/Config.json");
//const checkOwner = require("../../Tools/checkOwner");
const Blacklist = require('../../Database/Schemas/Blacklist');
const Disable = require('../../Database/Schemas/DisableCommands')
const ms = require('ms');

require("../../Utils/Tools/InlineReply");

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
    if(!guildConfig) {
      await new GuildConfig({
        guildName: message.guild.name,
        guildId: message.guild.id,
        prefix: "&",
      }).save();
      client.logger.dtb(`Server: ${message.guild.name} Salvo na DataBase!`);
    }

    const guildConfigRoles = await GuildConfigRoles.findOne({
      guildId: message.guild.id,
    });
    if(!guildConfigRoles) {
      await new GuildConfigRoles({
        guildName: message.guild.name,
        guildId: message.guild.id,
      }).save();
      client.logger.dtb(`Server: ${message.guild.name}(Roles) Salvo na DataBase!`);
    }

    const guildConfigChannels = await GuildConfigChannels.findOne({
      guildId: message.guild.id,
    });
    if(!guildConfigChannels) {
      await new GuildConfigChannels({
        guildName: message.guild.name,
        guildId: message.guild.id,
      }).save();
      client.logger.dtb(`Server: ${message.guild.name}(Channels) Salvo na DataBase!`);
    }

    const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);

    const Prefix = guildConfig.get("prefix") || mentionRegexPrefix;
    const FindPrefix = guildConfig.prefix;
    const prefix = message.content.match(mentionRegexPrefix) ?
      message.content.match(mentionRegexPrefix)[0] : Prefix;
    client.prefix = prefix;

    if(message.content == prefix) return;

    if(!message.content.startsWith(prefix)) return;

    if(message.content.match(mentionRegex)) message.channel.send(`Meu Prefix para \`${message.guild.name}\` é: ${FindPrefix}`);

    if(message.content.startsWith(prefix)) {
      const [ cmd, ...args ] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));

      if(command) {
        const blacklistData = await Blacklist.findOne({ User: message.author.id });
        if (blacklistData && blacklistData.Blacklist === true) {
          return message.reply('Você está na **Blacklist** do Bot portanto não pod utilizar nenhum comando')
       }

        if (command.ownerOnly && !client.Tools.checkOwner(message.author.id)) {
          return message.reply("Comando restrito para o Dono do Bot");
        }

        if(command.guildOnly && !message.guild) {
          return message.reply("Comando Restrito para outro Servidor");
        }

        if(command.mjonly && !client.Tools.checkMJGuild(message.guild)) {
          return message.reply("Comando Restrito para outro Servidor");
        }
        
        if(command.testOnly && !client.Tools.checkTestGuild(message.guild)) {
          return message.reply("Este Comando só pode ser utilizado no servidor de testes do meu Dev!")
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
                `You are missing ${client.Tools.formatArray(
                  missing.map(client.Tools.formatPerms)
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
                `Faltam as seguintes Permissões: ${client.Tools.formatArray(
                  missing.map(client.Tools.formatPerms)
                )} Para executar esse Comando!`
              );
            }
          }
        }
        
        const tools = client.Tools
        const player = client.music.players.get(message.guild.id);
        command.run(client, message, args, prefix, player, tools, command);
      }
    }
  }
};
