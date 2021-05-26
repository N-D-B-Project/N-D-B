const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

// Schemas
const GuildConfig = require("../../Database/Schema/GuildConfig");
const GuildConfigRoles = require('../../Database/Schema/GuildRoles');
const GuildConfigChannels = require('../../Database/Schema/GuildChannel');
const Cash = require("../../Database/Schema/NDCash");
const Blacklist = require('../../Database/Schema/Blacklist');
const Disable = require('../../Database/Schema/DisableCommands')

const Config = require("../../Config/Config.json");
const ms = require('ms');

require("../../Utils/Tools/InlineReply");

module.exports = class MessageEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
        name: "message",
        once: false
    });
  }

  async run(client, message, guild) {
    //# Check message type
    if(message.author.bot) return;
    if(message.channel.type === "DM") return;
    
    //! GuildConfigs
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

    //@ Prefix
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

    //$ Commands
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

    //* AntiSpam
    const usersMap = new Map();
    const MutedRoleFind = guildConfigRoles.mutedRole;
    const logChannelFind = guildConfigChannels.logChannel;
    const floodChannelFind = guildConfigChannels.floodChannel;
    const MutedRole = message.guild.roles.cache.find(r => r.id === `${MutedRoleFind}`);
    const LogChannel = message.guild.roles.cache.find(r => r.id === `${logChannelFind}`);
    const FloodChannel = message.guild.roles.cache.find(r => r.id === `${floodChannelFind}`);
    
    if(guildConfig.antispam == undefined || false) {
      return;
    } else if(guildConfig.antispam == true){
      if(message.channel === FloodChannel || LogChannel) return; 
      if(usersMap.has(message.author.id)) {
        const userData  = usersMap.get(message.author.id);
        let msgCount = userData.msgCount;
        if(parseInt(msgCount) === 10) {
          message.member.roles.add(MutedRole)
          message.channel.send("mute")
          LogChannel.send(
            new Discord.MessageEmbed()
            .setColor("#00c26f")
            .setTitle("Membro Mutado pelo sistema Anti-Spam")
            .setAuthor(message.member.name, message.member.iconURL())
            .setDescription(`O Membro ${message.member.name} foi mutado por Flood`)
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setTimestamp()
          )
        } else {
          msgCount++;
          userData.msgCount = msgCount;
          userData.set(
            message.author.id,
            userData
          );
        } 
      } else {
        usersMap.set(message.author.id, {
          msgCount: 1,
          lastMessage: message,
          timer: null
        });
        setTimeout(() => {
          usersMap.delete(message.author.id);
        }, 5000);
      }
    }

    //% RandomReaction
    const porcentagem = Math.floor(Math.random() * 26)

    if(porcentagem === 25) {
      const React = client.Tools.randomEmoji[Math.floor(Math.random() * client.Tools.randomEmoji.length)]
      message.react(React)
    }

    //TODO Economy
    Cash.findOne ({ userId: message.author.id, },
      async (err, cash) => {
        if(err) console.error("Economy Error: " + err);
        if(!cash) {
          const newCash = new Cash({
            username: message.author.tag,
            userId: message.author.id,
            ndcash: 0,
            propina: 0,
            emprego: "Desempregado",
            level: 1,
            skin: "Default",
          });
          newCash.save().catch((err) => console.error("newCash Err: " + err));
      }
    })
  }
};
