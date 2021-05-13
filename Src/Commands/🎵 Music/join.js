const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class JoinCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'join',
      category: '🎵 Music',
      aliases: ['entrar', 'entre', 'enter'],
      usage: '',
      description: 'Faz com que o Bot entre na call'
    });
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
  
    if (player.state !== "CONNECTED") player.connect();
    message.channel.send(`Entrando no Canal \`${channel.name}\``)
  }
};
