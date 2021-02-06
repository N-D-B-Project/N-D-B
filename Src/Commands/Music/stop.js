const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class StopCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'stop',
      category: 'Music',
      aliases: ['parar'],
      usage: '',
      description: 'Para de tocar a musica'
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
    
    if (!channel) return message.reply("Player não iniciado nesse servidor");
    if (channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");
    
    player.stop();
    return message.reply("Musica/Queue parada");
  }
}