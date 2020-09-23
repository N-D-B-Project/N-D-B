const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const AB = require("../../../Config/Abbreviations.js");

module.exports = class AntiRaidCommand extends BaseCommand {
  constructor() {
    super('testlockdown', 'Central', []);
  }

  async run(client, message, args) {
    const Membros = await message.guild.roles.cache.find(r => r.id === "717094267243462688")
    const Mention = message.author;
    const MsgSender = message.channel.send;
    const Content = message.content;

    const SintaxErr = new Discord.MessageEmbed()
      .setTitle("❌ | Erro de Sintaxe")
      .setColor("RANDOM")
      .setDescription(`O método correto de utilizar o comando é: lockdown on | off`)
      //.setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp()
      
    if (!message.member.roles.cache.some(r => [
        "731697917403988008", // Supreme Master
        "717100558095351878", // ADM
        "717769754345209966"  // Cargo Rápido
    ].includes(r.id))) {
        return message.channel.send(`${Mention} este comando é restrito para a Staff!`)
    } else if (Content.includes("on")) {
      await Membros.setPermissions(67174465);
      await message.channel.send(`O Sistema de AntiRaid foi Ligado por ${Mention}`)
    } else if (Content.includes("off")) {
      await Membros.setPermissions(133684545);
      await message.channel.send(`O Sistema de AntiRaid foi Desligado por ${Mention}`)
    } else {
      return message.channel.send(`${Mention} ${SintaxErr}`)
    }
  }
}