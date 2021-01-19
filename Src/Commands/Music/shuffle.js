const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ShuffleCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'shuffle', //name
      category: 'Music', //category
      aliases: ['misturar'], //aliases
      usage: '', //usage
      description: 'Põe em ordem aleatória as musicas da fila' //description
    });
  }

  async run(client, message, args) {
    const player = message.client.music.players.get(message.guild.id);
    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    ////
    if(!player) return message.channel.send(PlayerEmbed)

    const { channel } = message.member.voice;
    
    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");
    
    player.queue.shuffle();
    message.delete().catch((O_o) => {});
    message.channel.send("Fila embaralhada!");
  
  }
};