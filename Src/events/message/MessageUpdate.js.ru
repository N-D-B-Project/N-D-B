// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class MessageUodateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(client, message, oldMessage, newMessage) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    })
    const FindChannel = guildConfig.deleteMsgChannelId;
    const Channel = client.channels.cache.get(`${FindChannel}`);
    //const Channel = client.channels.cache.get("731288262035112045");
    if(message.channel === Channel) return;
    if(message.author.bot) return;
    
    if(Channel) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Mensagem Atualizada")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField("Editada no Canal", message.channel)
        .addField("Mensagem antiga", oldMessage)
        .addField("Nova Mensagem", newMessage)
        .setColor("RANDOM")
        .setTimestamp()
      Channel.send(embed)
  }
}