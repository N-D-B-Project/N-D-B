const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class LeaveCommand extends BaseCommand {
  constructor() {
    super(
      'leave', //name
      'Music', //category
      ['sair'], //aliases
      '', //usage
      'Faz com que o bot saia da call' //description
    );
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
    if(!player) return message.channel.send(PlayerEmbed)
    
    //console.log(player);
    // if(!player) return message.reply("player não iniciado nesse servidor");

    const { channel } = message.member.voice;
    
    if(!channel) return message.reply("Você não está em um canal de voz");
    if(channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");

    player.destroy(); 
    message.channel.send("Adios 👋");
  }
}