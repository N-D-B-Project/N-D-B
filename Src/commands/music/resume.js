const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ResumeCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'resume', //name
      category: 'Music', //category
      aliases: ['continuar'], //aliases
      usage: '', //usage
      description: 'Tira a musica do pause' //description
    });
  }

  async run(client, message, args) {
    const player = message.client.music.players.get(message.guild.id);
    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    ////
    if(!player) return message.channel.send(PlayerEmbed)

    const { channel } = message.member.voice;
    
    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");
    if (!player.paused) return message.reply("O Player já está tocando.");

    player.pause(false);
    return message.reply("Player não está mais pausado");
  }
}