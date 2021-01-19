const BaseCommand = require("../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../../database/schemas/GuildConfig");
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


module.exports = class SetDeletedMessagesChannelCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setxpchannel', //name
      category: 'Server Settings', //category
      aliases: [''], //aliases
      usage: 'setxpchannel <Id do canal>', //usage
      description: 'Define me qual canal o Bot mandará as mensagens quando algum membro sobe de nível' //description
    });
  }

  async run(client, message, args) {
    if(message.member.hasPermission("MANAGE_GUILD")) {
      const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
      })
      const FindChannel = guildConfig.XpChannelId;
      const Channel = client.channels.cache.get(`${FindChannel}`);
      const SintaxErrEmbed = new Discord.MessageEmbed()
        .setTitle("❌ | Erro de Sintaxe")
        .setColor("RANDOM")
        .setDescription("Utilize: "+guildConfig.prefix+"setxpchannel <Channel ID>")
        .setTimestamp();
      if(!args[0]) return message.channel.send(SintaxErrEmbed)
      
      guildConfig.XpChannelId = args[0]
      guildConfig.save().catch((err) => console.log("SetDelChannel Error: " + err))
      const SetChannelEmbed = new Discord.MessageEmbed()
        .setTitle("✔ | Canal Definido!")
        .setColor("RANDOM")
        .setDescription("Agora sempre que um membro subir de nível vou mandar as mensagens em: " + "<#"+Channel+">")
        .setTimestamp();
      message.channel.send(SetChannelEmbed)

    } else {
      message.channel.send("Você não tem permissão para utilizar este comando")
    }
  }
}