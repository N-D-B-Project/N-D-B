// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");
const GuildConfig = require("../../Database/Schemas/GuildConfig");
const GuildConfigChannels = require("../../Database/Schemas/GuildChannel");

module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super('messageDelete');
  }
  
  async run(client, message) {
    //if(message.author.bot) return;
    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })
    const guildConfigChannels = await GuildConfigChannels.findOne({ guildId: message.guild.id })
    const FindChannel = guildConfigChannels.logChannel
    const Channel = client.channels.cache.get(`${FindChannel}`);
    if(message.channel === Channel) return;
    //if(message.author.bot || !message.guild) return;
    const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
    
    if(Channel) {
      try {
        const embed = new Discord.MessageEmbed()
        .setTitle("Mensagem Deletada")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField("Deletada no Canal", message.channel)
        .setDescription([
          message.content, 
          `${attachments ? `**❯ Arquivos Anexados:** ${attachments.join('\n')}` : ''}`
        ])
        .setColor("RANDOM")
        .setTimestamp()
      Channel.send(embed)

      } catch (error) {
        return;
      }
    }
  }
}