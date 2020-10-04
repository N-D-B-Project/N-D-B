const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require('../../database/schemas/GuildConfig');

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class ChangePrefixCommand extends BaseCommand {
  constructor() {
    super(
      'setprefix', //name
      'ModTools', //category
      ['definirprefix', 'definirprefixo', 'alterarprefix', 'alterarprefixo', 'changeprefix'], //aliases
      'setprefix <Novo Prefix>', //usage
      'Altera na DataBase o Prefix do server' //description
    );
  }

  async run(client, message, args) {
    if(message.member.hasPermission("MANAGE_GUILD")) {
      const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
      })
      const SintaxErrEmbed = new Discord.MessageEmbed()
        .setTitle("❌ | Erro de Sintaxe")
        .setColor("RANDOM")
        .setDescription("Utilize: "+guildConfig.prefix+"setprefix <Novo Prefix>")
        .setTimestamp();
      if(!args[0]) return message.channel.send(SintaxErrEmbed)
      
      const newPrefixEmbed = new Discord.MessageEmbed()
        .setTitle("✔ | Prefix atualizado!")
        .setColor("RANDOM")
        .setDescription("Novo prefix: " + args[0])
        .setTimestamp();
      guildConfig.prefix = args[0]
      guildConfig.save()
      message.channel.send(newPrefixEmbed)

    } else {
      message.channel.send("Você não tem permissão para utilizar este comando")
    }
  }
}
