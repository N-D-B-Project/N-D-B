const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const mongoose = require("mongoose");
//const {} = require("../../../Config/Abbreviations.js");
const GuildConfig = require("../../database/schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = class AntiRaidCommand extends BaseCommand {
  constructor() {
    super(
      'antiraid', //name
      'ModTools', //category
      ['lockdown'], //aliases
      'antiraid on | off>', //usage
      'Bloqueia o servidor inteiro para nenhum membro mandar mensagens' //description
    );
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    })
    const FindRole = guildConfig.defaultRole;
    const Membros = message.guild.roles.cache.find(r => r.id === `${FindRole}`);
    const Mention = message.author;
    const MsgSender = message.channel.send;
    const Content = message.content;

    const SintaxErr = new Discord.MessageEmbed()
      .setTitle("❌ | Erro de Sintaxe")
      //.setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setColor("RANDOM")
      .setDescription(`O método correto de utilizar o comando é: lockdown on | off`)
      .setTimestamp()
    if(!message.member.hasPermission("MANAGE_GUILD")) {
      message.channel.send(`${Mention} este comando é restrito para a Staff!`)

    } else if (Content.includes("on")) {
      await Membros.setPermissions(67174465).catch(console.error);
      await message.channel.send(`O Sistema de AntiRaid foi Ligado por ${Mention}`)

    } else if (Content.includes("off")) {
      await Membros.setPermissions(133684545).catch(console.error);
      await message.channel.send(`O Sistema de AntiRaid foi Desligado por ${Mention}`)
      
    } else {
      return message.channel.send(`${Mention} ${SintaxErr}`)
    }
  }
}