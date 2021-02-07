const BaseCommand = require('../../Utils/Structures/BaseCommand');
const Discord = require('discord.js');
const AB = require("../../../Config/Abbreviations.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class RateWaifuCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'ratewaifu',
      category: 'Anime',
      aliases: ['avaliarwaifu'],
      usage: 'ratewaifu <mencione um usuário>',
      description: 'o Bot lhe avalia dando uma nota de o quão waifu você é'
    });
  }

  async run(client, message, args) {
    let notas = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ]

    let nota = notas [Math.floor(Math.random() * notas.length)];

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`Eu lhe dou a nota ${nota}!`)
      .setTimestamp();
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
}