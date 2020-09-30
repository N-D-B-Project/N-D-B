// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
const BaseEvent = require('../../utils/structures/BaseEvent');
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../database/schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super('messageDelete');
  }
  
  async run(client, message) {
    //if(message.author.bot) return;
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    })
    const FindChannel = guildConfig.deleteMsgChannelId;
    const Channel = client.channels.cache.get(`${FindChannel}`);
    //const Channel = client.channels.cache.get("731288262035112045");
    if(Channel) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Mensagem Deletada")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField("Deletada no Canal", message.channel)
        .setDescription(message.content)
        .setColor("RANDOM")
        .setTimestamp()
      Channel.send(embed)
    }
  }
}