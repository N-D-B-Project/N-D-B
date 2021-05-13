const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");
const Config = require("../../Config/Config.json");
const GuildConfig = require("../../Database/Schemas/GuildConfig");
const GuildConfigRoles = require("../../Database/Schemas/GuildRoles");
const GuildConfigChannels = require("../../Database/Schemas/GuildChannel");

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(client, message, guild) {
    if(message.author.bot) return;

    const usersMap = new Map();

    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id})
    const guildConfigRoles = await GuildConfigRoles.findOne({ guildId: message.guild.id})
    const guildConfigChannels = await GuildConfigChannels.findOne({ guildId: message.guild.id})
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
  }
}