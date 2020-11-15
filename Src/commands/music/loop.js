const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class LoopCommand extends BaseCommand {
  constructor() {
    super(
      'loop', //name
      'Music', //category
      ['repeat', 'repetir'], //aliases
      '', //usage
      'Põe a musica ou a fila de musicas em loop' //description
    );
  }

  async run(client, message, args) {
    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();
    ////
    const Player = message.client.music.players.get(message.guild.id);
    // if(!Player) return message.reply("Player não iniciado nesse servidor");
    if(!Player) return message.channel.send(PlayerEmbed);

    const { Channel } = message.member.voice;
    
    if(!Channel) return message.reply("Você não está em um canal de voz");
    if(Channel.id !== Player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");
  
    if(args.length && /queue/i.test(args[0])) {
      Player.setQueueRepeat(!Player.queueRepeat);
      const QueueRepeat = Player.queueRepeat ? "Ativo" : "Desativado";
      // return message.reply(`${QueueRepeat} Fila em Loop`);
      const QueueEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("#00c26f")
        .setTitle("Loop ♾")
        .addField("Fila em Loop", `${QueueRepeat}`)
        .setFooter(client.user.tag, client.user.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(QueueEmbed);
    }

    Player.setTrackRepeat(!Player.trackRepeat);
    const TrackRepeat = Player.trackRepeat ? "Ativo" : "Desativado";
    // return message.reply(`${TrackRepeat} Musica em Loop`);
    const TrackEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Loop ♾")
      .addField("Musica em Loop", `${TrackRepeat}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(TrackEmbed);
  }
}