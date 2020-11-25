const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const levels = require("../../Tools/bassboost");

module.exports = class BassBoostCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'bassboost', //name
      category: 'Music', //category
      aliases: ['Bass', 'bass', 'bb'], //aliases
      usage: 'bassboost <level>', //usage
      description: 'Aumenta o grave da Musica' //description
    });
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
    const player = message.client.music.players.get(message.guild.id);
    // if(!player) return message.reply("player não iniciado nesse servidor");
    if(!player) return message.channel.send(PlayerEmbed);
    if(!args[0]) return message.channel.send("Esses são os níveis disponíveis\n none: 0.0\n low: 0.10\n medium: 0.15\n high: 0.25\n veryhigh: 0.5\n ultrahigh: 0.75\n megahigh: 1\n extreme: 2\n earhape: 10\n surdo: 1000\n")

    const { channel } = message.member.voice || message.author.voice;
    
    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz.");

    let level = "low";
    if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();
    if(args[0] === "off") {
      const BassOffEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("#00c26f")
        .setTitle(":loudspeaker: BassBoost")
        .setDescription("BassBoost Desativado")
        .setFooter(client.user.tag, client.user.displayAvatarURL())
        .setTimestamp();
      player.clearEQ()
      return message.channel.send(BassOffEmbed)
    }

    player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

    //return message.reply(`BassBoost Definido como: ${level}`);
    const BassEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle(":loudspeaker: BassBoost")
      .addField("Bass Boost Definido", `${level}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(BassEmbed)
  }
}