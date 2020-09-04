const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const AB = require("../../../Config/Abbreviations.json");

module.exports = class AntiRaidCommand extends BaseCommand {
  constructor() {
    super('lockdown', 'ManoJobs', []);
  }

  async run(client, message, args) {
    const Membros = await message.guild.roles.cache.find(r => r.id === "647439532144328716")
    const Mention = message.author;
    const MsgSender = message.channel.send;
    const Content = message.content;

    const SintaxErr = new Discord.MessageEmbed()
      .setTitle("❌ | Erro de Sintaxe")
      //.setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setColor("RANDOM")
      .setDescription(`O método correto de utilizar o comando é: lockdown on | off`)
      .setTimestamp()
      
    if (!message.member.roles.cache.some(r => [
        "581637595717566464", // ADM
        "581849490038718465", // Final Boss
        "712764913977786448", // Mod
        "585566255403106313", // Auxiliar
        "601072099188015135", // Vigilante
        "744761005267091516", // YouTube Mod
        "644680011059822643"  // Staff
    ].includes(r.id))) {
        return MsgSender(`${Mention} este comando é restrito para a Staff!`)
    } else if (Content.includes("on")) {
      await Membros.setPermissions(67174465).catch(console.error);
      await MsgSenderSender(`O Sistema de AntiRaid foi Ligado por ${Mention}`)
    } else if (Content.includes("off")) {
      await Membros.setPermissions(133684545).catch(console.error);
      await MsgSender(`O Sistema de AntiRaid foi Desligado por ${Mention}`)
    } else {
      return MsgSender(`${Mention} ${SintaxErr}`)
    }
  }
}