
const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'jump',
      category: 'Music',
      aliases: ['pular'],
      usage: 'pular <Numero da musica para ser pulada>',
      description: 'Pula de uma musica para outra',
    });
  }

  async run(client, message, args) {
    const player = message.client.music.players.get(message.guild.id);

    const PlayerEmbed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor("#00c26f")
    .setTitle("Player")
    .addField(
      ":no_entry_sign: Player não iniciado em",
      `${message.guild.name}`
    )
    .setThumbnail()
    .setFooter(client.user.tag, client.user.displayAvatarURL())
    .setTimestamp();
    ////
    //console.log(player);
    // if(!player) return message.reply("player não iniciado nesse servidor");
    if (!player) return message.channel.send(PlayerEmbed);

    const { channel } = message.member.voice;

    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel)
      return message.reply("Você não está no mesmo canal de voz");
      
    if(!args[0]) return message.reply("Diga quantas musicas quer pular")
    if(isNaN(args[0])) return message.reply("Numero invalido")
    let trackn = Number(args[0])
    if(trackn > player.queue.size) return message.reply("Essa musica não está na fila")
    player.queue.remove(0,trackn-1);
    player.stop()
    const embed = new Discord.MessageEmbed()
    .setTitle(`⏭ Pulando: \`${trackn}\` Musicas`)
    .setColor("#00c26f")
    .setFooter(client.user.tag, client.user.displayAvatarURL())
    return message.channel.send(embed);
  }
}

