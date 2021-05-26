const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class PauseCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'pause',
      category: '🎵 Music',
      aliases: ['pausar'],
      usage: '',
      description: 'Pausa a musica'
    });
  }

  async run(client, message, args) {
    const player = client.music.players.get(message.guild.id);
    //if (!player) return message.reply("Player não iniciado nesse servidor");
    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    ////
    if (!player) return message.channel.send(PlayerEmbed)
    const { channel } = message.member.voice;
    
    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");
    if (player.paused) return message.reply("O Player já está pausado");

    player.pause(true);
    return message.reply("Player Pausado");
    
  }
}