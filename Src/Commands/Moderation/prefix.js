const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require('../../Database/Schemas/GuildConfig');
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class ChangePrefixCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setprefix',
      category: 'Moderation',
      aliases: ['definirprefix', 'definirprefixo', 'alterarprefix', 'alterarprefixo', 'changeprefix'],
      usage: 'setprefix <Novo Prefix>',
      description: 'Altera na DataBase o Prefix do server'
    });
  }

  async run(client, message, args) {
    if(message.member.hasPermission("MANAGE_GUILD")) {
      const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
      })
      const SintaxErrEmbed = new Discord.MessageEmbed()
        .setTitle(await client.translate("❌ | Erro de Sintaxe"))
        .setColor("#00c26f")
        .setDescription(await client.translate("Utilize: "+guildConfig.prefix+"setprefix <Novo Prefix>", message))
        .setTimestamp();
      if(!args[0]) return message.channel.send(SintaxErrEmbed)
      
      const newPrefixEmbed = new Discord.MessageEmbed()
        .setTitle(await client.translate("✔ | Prefixo atualizado!", message))
        .setColor("#00c26f")
        .setDescription(await client.translate("Novo prefix: ", message) + args[0])
        .setTimestamp();
      guildConfig.prefix = args[0]
      guildConfig.save()
      message.channel.send(newPrefixEmbed)

    } else {
      message.channel.send(await client.translate("Você não tem permissão para utilizar este comando", message))
    }
  }
}
