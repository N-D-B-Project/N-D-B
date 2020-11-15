const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const solenolyrics = require("solenolyrics");

module.exports = class LyricsCommand extends BaseCommand {
  constructor() {
    super(
      'lyrics', //name
      'Music', //category
      ['ly', 'letra'], //aliases
      '', //usage
      'Mostra a Letra da musica que está tocando' //description
    );
  }

  async run(client, message, args) {
    const player = client.music.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
    });

    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField("Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();
    ////
    //console.log(player);
    // if(!player) return message.reply("player não iniciado nesse servidor");
    if(!player) return message.channel.send(PlayerEmbed)

    const { channel } = message.member.voice;
    
    if(!channel) return message.reply("Você não está em um canal de voz");
    if(channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");

    const req = player.queue.current;

    if (!req) return message.channel.send("Nenhuma musica tocando nesse servidor");

    var lyrics = await solenolyrics.requestLyricsFor(req);
    //message.channel.send(lyrics);(req);

    
    if (lyrics >= 2048) {
      ly = lyrics.split(" ");
      const first = ly.slice(0, 200).join(" ");
      const second = ly.slice(200, ly.length - 1).join(" ");

      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${req.title} by ${req.author}`)
      .setDescription(first)

      const embed1 = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(second)
      message.channel.send(embed);
      message.channel.send(embed1);
    }
  }
}