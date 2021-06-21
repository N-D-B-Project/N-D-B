const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");

// Schemas
const GuildConfig = require("../../Database/Schema/GuildConfig");
const GuildConfigChannels = require("../../Database/Schema/GuildChannel");

module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
        name: "messageDelete"
    });
  }
  
  async run(client, message) {
    //# Check message author/type
    try {
      if(message.author.bot) return;
      if(message.channel.type === "DM") return;
    } catch {}
    
    //$ DeletedLog
    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })
    const guildConfigChannels = await GuildConfigChannels.findOne({ guildId: message.guild.id })
    const FindChannel = guildConfigChannels.logChannel
    const Channel = client.channels.cache.get(`${FindChannel}`);
    if(message.channel === Channel) return;
    if(guildConfig.deletedlog === true) {
        const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;

        if(Channel) {
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
        }
    }

    //! Snipe
    client.snipe.set(message.channel.id, {
      check:true,
      content:message.content,
      author:message.author,
      image:message.attachments.first() ? message.attachments.first().proxyURL : null
    })
  }
}