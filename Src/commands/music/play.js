const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class PlayCommand extends BaseCommand {
  constructor() {
    super("play", "music", []);
  }

  async run(client, message, args) {
    /*
    const { channel } = message.member.voice;
    if (channel) {
      const player = client.music.players.spawn({
        guild: message.guild,
        voiceChannel: channel,
        textChannel: message.channel,
      });
      //client.musicPlayers.set(message.guild.id, player);
      //console.log(client.musicPlayers);
      //console.log("Conectado em um canal de voz.");
    } else {
      message.channel.send(
        "Por Favor conecte-se a um na canal de voz para utilizar este comando!"
      );
    }
    */
    const query = args.join(" ");
    //console.log(query);
    const searchResults = await client.music.search(query, message.author);
    //console.log(searchResults);
    //console.log(searchResults.tracks.length);
    let i = 0;
    const tracks = searchResults.tracks.slice(0, 3);
    const tracksInfo = tracks
      .map((r) => `${++i}) ${r.title} - ${r.uri}`)
      .join("\n");
    //console.log(tracksInfo);

    const embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setDescription(tracksInfo)
      .setFooter("Resultado da Pesquisa")
      .setColor("#00c26f");

    message.channel.send(embed);

    const filter = (m) =>
      message.author.id === m.author.id &&
      m.content >= 1 &&
      m.content <= tracks.length;

    try {
      const response = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 1000000,
        errors: ["time"],
      });

      if (response) {
        const entry = response.first().content;
        //console.log(entry);
        const player = client.music.players.get(message.guild.id);
        const track = tracks[entry - 1];
        player.queue.add(track);

        const embed2 = new Discord.MessageEmbed()
          .setAuthor(client.user.tag, client.user.displayAvatarURL())
          .setDescription("Musica adicionada na fila")
          .addField("Musica", `${track.title}`)
          .setColor("#00c26f")
          .setFooter(client.user.tag, client.user.displayAvatarURL);

        message.channel.send(embed2);
        if (!player.playing) player.play();
      }
    } catch (err) {
      console.log(err);
    }
  }
};
