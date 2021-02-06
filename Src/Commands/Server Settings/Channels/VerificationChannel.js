const BaseCommand = require("../../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../../Database/Schemas/GuildConfig");
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


module.exports = class SetVerificationChannelCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setverificationchannel',
      category: 'Server Settings',
      aliases: ['svc'],
      usage: 'svc <Id do canal>',
      description: 'Define me qual canal o Bot irá criar uma verificação'
    });
  }

  async run(client, message, args) {
    if(message.member.hasPermission("MANAGE_GUILD")) {
      const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
      })
      const FindChannel = guildConfig.VerificationChannelId;
      const Channel = client.channels.cache.get(`${FindChannel}`);
      const SintaxErrEmbed = new Discord.MessageEmbed()
        .setTitle("❌ | Erro de Sintaxe")
        .setColor("RANDOM")
        .setDescription("Utilize: "+guildConfig.prefix+"svc <Channel ID>")
        .setTimestamp();
      if(!args[0]) return message.channel.send(SintaxErrEmbed)
      
      guildConfig.VerificationChannelId = args[0]
      guildConfig.save().catch((err) => console.log("SetVerificationChannel Error: " + err))
      const SetChannelEmbed = new Discord.MessageEmbed()
        .setTitle("✔ | Canal Definido!")
        .setColor("RANDOM")
        .setDescription("Irei Criar uma mensagem de verificação em " + "<#"+Channel+">")
        .setTimestamp();
      message.channel.send(SetChannelEmbed)

    } else {
      message.channel.send("Você não tem permissão para utilizar este comando")
    }
  }
}