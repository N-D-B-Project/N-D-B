const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const hD = require("humanize-duration");
const ms = require("parse-ms");

module.exports = class NowPlayingCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'nowplaying', //name
      category: 'Music', //category
      aliases: ['np'], //aliases
      usage: '', //usage
      description: 'Mostra qual musica está tocando e quando tempo falta para acabar' //description
    });
  }

  async run(client, message, args) {
    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    ////
    const player = message.client.music.players.get(message.guild.id);
    //console.log(player);
    // if(!player) return message.reply("player não iniciado nesse servidor");
    if(!player) return message.channel.send(PlayerEmbed)

    const { channel } = message.member.voice;
    
    if(!channel) return message.reply("Você não está em um canal de voz");
    if(channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");

    
    const { author, duration, identifier, isSeekable, isStream, requester, thumbnail, title, track, uri } = player.queue.current;
    const timer = hD(duration, true);

    const time = ms(duration);
    const timer2 = `${time.hours ? time.hours > 10 ? time.hours :  `0${time.hours}` : ""}${time.hours ? ":" : ""}${time.minutes ? time.minutes >= 10 ? time.minutes : `0${time.minutes}` : "00"}:${time.seconds ? time.seconds > 10 ? time.seconds : `0${time.seconds}` : ""}`


    const V = "<a:Accept:719710630881525881>";
    const X = "<a:1603_Animated_Cross:730729650296193044>";
    const SP = player.playing ? `${V} Tocando` : `${X} Pausado`;
    const BB = player.bands ? `${V} Ativado` : `${X} Desativado`;
    
    const NPEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(thumbnail)
        .setColor("#00c26f")
        .setTitle("Tocando Agora")
        .setDescription([
          `[${title}](${uri})`,
          `${timer}`
        ])
        .addFields(
          { name: ":crown: Autor", value: author, inline: false, },
          { name: "🎤 Tocando", value: SP, inline: true},
          { name: "📢 BassBoost", value: BB, inline: true}
        )
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();
      return message.channel.send(NPEmbed);
  }
}