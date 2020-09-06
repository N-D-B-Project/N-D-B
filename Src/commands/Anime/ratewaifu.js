const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const AB = require("../../../Config/Abbreviations.json");

module.exports = class RateWaifuCommand extends BaseCommand {
  constructor() {
    super('ratewaifu', 'Anime', []);
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