const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");

//const {} = require("../../../Config/Abbreviations.js");

module.exports = class BassBoostCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'bassboost',
      category: '🎵 Music',
      aliases: ['Bass', 'bass', 'bb'],
      usage: 'bassboost <level>',
      description: 'Aumenta o grave da Musica'
    });
  }

  async run(client, message, args) {

    const levels = {
      //none: 0.0,
      low: 0.10,
      medium: 0.15,
      high: 0.25,
      veryhigh: 0.5,
      ultrahigh: 0.75,
      megahigh: 1,
      extreme: 2,
      earhape: 10,
      surdo: 1000,
      infinity: 999999999999999999999,
    }

    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: " + "Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();
    ////
    const player = client.music.players.get(message.guild.id);
    console.log(player)
    // if(!player) return message.reply("player não iniciado nesse servidor");
    if(!player) return message.channel.send(PlayerEmbed);
    if(!args[0]) return message.channel.send(`Esses são os níveis disponíveis: ` `${levels}`)

    const { channel } = message.member.voice || message.author.voice;
    
    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz.");

    let level = "low";
    if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();
    if(args[0] === "off") {
      const BassOffEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(black)
        .setTitle(":loudspeaker: BassBoost")
        .setDescription("BassBoost " + "Desativado")
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
      .addField("BassBoost " + "Definido", `${level}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(BassEmbed)
  }
}