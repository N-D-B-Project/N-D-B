const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const hD = require("humanize-duration");

module.exports = class PlayCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "play",
      category: "🎵 Music",
      aliases: ["p", "tocar"],
      usage: "play <Nome da Musica>",
      description: "Toca a musica escolhida no canal de voz"
    });
  }

  async run(client, message, args) {
    try {
      const { channel } = message.member.voice;
    if (!channel) return message.reply("Você não está em um canal de voz");

    const player = client.music.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
    });

    if (player.state !== "CONNECTED") player.connect();

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

    if (channel.id !== player.voiceChannel)
      return message.reply("Você não está no mesmo canal de voz");

    if (!args.length)
      return message.reply(
        "Você deve digitar um link ou algo para mim pesquisar"
      );

    const search = (
      message.content.slice(6),
      message.content,
      message.author,
      args,
      // ...args,
      args[0],
      args.join(" ")
    )
    let res;

    const SpotLink = [
      "https://open.spotify"
    ]
    const DeLink = [
      "https://www.deezer"
    ]

    if(message.content.includes(SpotLink)) {
      var YSEmoji = "<:Spotify:775154334832001044>"
    } else if (message.content.includes(DeLink)) {
      var YSEmoji = ""
    } else if(!message.content.includes(SpotLink) && !message.content.includes(DeLink)) 
    var YSEmoji = "<:youtube:730741995416453150>"

    try {
      res = await player.search(search, ...args, message.author);
      if (res.loadType === "LOAD_FAILED") {
        throw res.exception;
        //message.channel.send("Ocorreu um erro");
      }
      if (res.loadType === "NO_MATCHES") {
        if (!player.queue.current) {
          setTimeout(() => player.destroy(), 60000);
        }
        return message.channel.send("Nenhuma musica foi encontrada");
      }
      //if (res.loadType === "SEARCH_RESULT");
      
      if (res.loadType === "SEARCH_RESULT" || "TRACK_LOADED") {
        player.queue.add(res.tracks[0]);
  
        const { author, duration, identifier, isSeekable, isStream, requester, thumbnail, title, track, uri, } =res.tracks[0];
  
        if (!player.playing && !player.paused && !player.queue.size)
          player.play();
        const timer = hD(duration, {
          language: "pt",
          units: ["h", "m", "s"],
        }); //, { language: "pt", units: ["h", "m", "s"], decimal: ":"}
        const Embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setThumbnail(`${thumbnail}`)
          .setColor("#00c26f")
          .setDescription(":musical_note: Musica adicionada na fila")
          .addField(
            `${YSEmoji} Musica`,
            `[${title}](${uri})`
          )
          .addFields(
            { name: ":crown: Autor", value: author, inline: true },
            { name: "⏲️ Tempo", value: timer, inline: true },
            //{ name: ":newspaper: URL", value: `[Clique aqui para abrir](${uri})`, inline: false }
          )
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();
        return message.channel.send(Embed);
      }
      
      if (res.loadType === "PLAYLIST_LOADED") {
        const URL = args.join(" ");
        player.queue.add(res.tracks);
  
        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        )
          player.play();
        const timer2 = hD(res.playlist.duration, {
          language: "pt",
          units: ["h", "m", "s"],
        }); //, { language: "pt", units: ["h", "m", "s"], decimal: ":"}
        const PlaylistEmbed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setThumbnail(res.tracks[0].thumbnail)
          .setColor("#00c26f")
          .setDescription(":notes: Playlist adicionada na fila")
          .addField(
            `${YSEmoji} Playlist`,
            `[${res.playlist.name}](${URL})`
          )
          .addFields(
            { name: ":crown: Autor", value: res.tracks[0].author, inline: true, },
            { name: "⏲️ Tempo", value: timer2, inline: true },
            //{ name: ":newspaper: URL", value: `[Clique aqui para abrir](${URL})`, inline: false, }
          )
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();
        return message.channel.send(PlaylistEmbed);
      }
    } catch (err) {
      //return message.reply(`Erro ao pesquisar: ${err.message}`);
      console.log(`Erro ao pesquisar: ${err.message}`);
    }
    } catch (error) {
      client.logger.music(error)
    }
  }
};
