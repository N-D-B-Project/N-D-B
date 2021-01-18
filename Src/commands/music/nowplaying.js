const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
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
  
    const song = player.queue.current;

    const { author, duration, identifier, isSeekable, isStream, requester, thumbnail, title, track, uri } = song;
    
    const V = "<a:Accept:719710630881525881>";
    const X = "<a:1603_Animated_Cross:730729650296193044>";
    const SP = player.playing ? `${V} Tocando` : `${X} Pausado`;
    const BB = player.bands ? `${V} Ativado` : `${X} Desativado`;
    
    const time = ms(song.duration);
    const done = ms(player.position);
    const Duration = `[${done.hours ? done.hours > 10 ? done.hours : `0${done.hours}` : ""}${done.minutes ? done.minutes >= 10 ? done.minutes : `0${done.minutes}` : "00"}:${done.seconds ? done.seconds > 10 ? done.seconds : `0${done.seconds}` : ""}` + " / " + `${time.hours ? time.hours > 10 ? time.hours : `0${time.hours}` : ""}${time.hours ? ":" : ""}${time.minutes ? time.minutes >= 10 ? time.minutes : `0${time.minutes}` : "00"}:${time.seconds ? time.seconds > 10 ? time.seconds : `0${time.seconds}` : ""}]`
    const percent = client.Tools.percentage(player.position, player.queue.current.duration, 20);
    const NPEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(thumbnail)
        .setColor("#00c26f")
        .setTitle("Tocando Agora")
        .setDescription([
          `[${title}](${uri})`,
        ])
        .addFields(
          { name: ":crown: Autor", value: author, inline: false, },
          { name: "🎤 Tocando", value: SP, inline: true},
          { name: "📢 BassBoost", value: BB, inline: true},
          { name: "🔁 Loop", value: `${player.trackRepeat ? `${V} Musica` : player.queueRepeat ? `${V} Queue` : `${X} Não`}`, inline: true },
          { name: "🔊 Volume", value: `${player.volume}%`, inline: true },
          { name: "⏳ Duração", value: Duration },
          { name: "⌚ Tempo", value: `${percent.bar} ${Math.round(percent.percent)}%` }
        )
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();
    return message.channel.send(NPEmbed);
      
    // const embed = new Discord.MessageEmbed()
    //     .setColor("#00c26f")
    //     .setTitle(`Tocando Agora`)
    //     .setThumbnail(song.thumbnail)
    //     .setFooter(message.author.tag)
    //     .setDescription(`**[${song.title}](${song.uri})**`)
    //     .addFields(
    //         { name: "Pedido por", value: song.requester },
    //         { name: "Loop", value: `${player.trackRepeat ? "Song" : player.queueRepeat ? "Queue" : "Não"}`, inline: true },
    //         { name: "Volume", value: `${player.volume}%`, inline: true },
    //         { name: "Duração", value: duration },
    //         { name: "Tempo", value: `${percent.bar} ${Math.round(percent.percent)}%` }
            
    //     )
    // message.channel.send(embed)
    }
}