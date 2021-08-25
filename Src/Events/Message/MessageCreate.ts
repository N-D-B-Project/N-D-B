import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import { BaseCommand } from "@Structures/BaseCommand";
import * as Discord from "discord.js";

module.exports = class MessageEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "messageCreate";
    const options = {
      name: "messageCreate",
      type: "on",
    };

    super(client, name, options);
  }

  async run(client: NDBClient, message: any) {
    //# Check message type
    if (message.author.bot || !message.guild) return;

    // if (message.partial) {
    //   console.log('The message is partial.');
    // } else {
    //   console.log('The message is not partial.');
    // }

    //! GuildConfigs
    const guildConfig = await client.MongoDB.FindGuildConfig(message.guild)
    if (!guildConfig) {
      await client.MongoDB.CreateGuildConfig(message.guild);
    }

    //TODO UserProfile
    const UserProfile = await client.MongoDB.FindUserProfile(message.author)
    if (!UserProfile) {
      await client.MongoDB.CreateUserProfile(message.author);
    }

    //@ Prefix
    const mentionRegex = RegExp(`^<@!${client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!${client.user.id}> `); 

    const Prefix = guildConfig.get("Settings.Prefix") || mentionRegexPrefix;
    const prefix = message.content.match(mentionRegexPrefix)
      ? message.content.match(mentionRegexPrefix)[0]
      : Prefix;

    if (message.content == prefix) return;

    if (!message.content.startsWith(prefix)) return;

    if (message.content.match(mentionRegex))
      message.channel.send(
        `Meu Prefix para \`${message.guild.name}\` é: ${Prefix}`
      );

    //$ Commands
    if (message.content.startsWith(prefix)) {
      const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      const command: BaseCommand = client.Tools.command.resolveCommand(cmd);

      if (command) {
        if (
          command.options.ownerOnly &&
          !this.client.Tools.checkOwner(message.author.id)
        )
          return message.reply("Comando restrito para o Dono do Bot");

        if (command.options.guildOnly && !message.guild)
          return message.reply("Comando Restrito para outro Servidor");

        if (command.options.nsfw && !message.channel.nsfw)
          return message.reply(
            "Esse Comando só pode ser executado em canais NSFW"
          );

        if (command.options.disable === true)
          return message.reply("Esse comando está desabilitado");

        if(command.options.ndcash && !UserProfile.NDCash.NDCash)  {
          return message.reply("Você não possui NDCash o suficiente para utilizar esse comando")
        } 

        if(command.options.ndcash && UserProfile.NDCash.NDCash) {
          UserProfile.NDCash.NDCash -= command.options.ndcash;
          UserProfile.save();
        }
          
        const tools = client.Tools;
        //const player = client.music.players.get(message.guild.id);
        const player = null;
        command.run(client, message, args, tools, player);
      }
    }

    // //* AntiSpam
    // const usersMap = new Map();
    // const MutedRoleFind = guildConfigRoles.mutedRole;
    // const logChannelFind = guildConfigChannels.logChannel;
    // const floodChannelFind = guildConfigChannels.floodChannel;
    // const MutedRole = message.guild.roles.cache.find(r => r.id === `${MutedRoleFind}`);
    // const LogChannel = message.guild.roles.cache.find(r => r.id === `${logChannelFind}`);
    // const FloodChannel = message.guild.roles.cache.find(r => r.id === `${floodChannelFind}`);

    // if(guildConfig.antispam == undefined || false) {
    //   return;
    // } else if(guildConfig.antispam == true){
    //   if(message.channel === FloodChannel || LogChannel) return;
    //   if(usersMap.has(message.author.id)) {
    //     const userData  = usersMap.get(message.author.id);
    //     let msgCount = userData.msgCount;
    //     if(parseInt(msgCount) === 10) {
    //       message.member.roles.add(MutedRole)
    //       message.channel.send("mute")
    //       LogChannel.send(
    //         new Discord.MessageEmbed()
    //         .setColor("#00c26f")
    //         .setTitle("Membro Mutado pelo sistema Anti-Spam")
    //         .setAuthor(message.member.name, message.member.iconURL())
    //         .setDescription(`O Membro ${message.member.name} foi mutado por Flood`)
    //         .setFooter(client.user.tag, client.user.displayAvatarURL())
    //         .setTimestamp()
    //       )
    //     } else {
    //       msgCount++;
    //       userData.msgCount = msgCount;
    //       userData.set(
    //         message.author.id,
    //         userData
    //       );
    //     }
    //   } else {
    //     usersMap.set(message.author.id, {
    //       msgCount: 1,
    //       lastMessage: message,
    //       timer: null
    //     });
    //     setTimeout(() => {
    //       usersMap.delete(message.author.id);
    //     }, 5000);
    //   }
    // }

    //% RandomReaction
    const porcentagem = Math.floor(Math.random() * 26)

    if(porcentagem === 25) {
      const React = client.Tools.randomEmoji[Math.floor(Math.random() * client.Tools.randomEmoji.length)]
      message.react(React)
    }

    
    
  }
};
