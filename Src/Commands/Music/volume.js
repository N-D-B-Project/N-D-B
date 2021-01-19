const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class VolumeCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'volume', //name
      category: 'Music', //category
      aliases: [''], //aliases
      usage: '', //usage
      description: 'Aumenta ou diminui o volume do Player' //description
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
    if (!args.length) return message.reply(`O Volume atual é: \`${player.volume}\`.`)

    const { channel } = message.member.voice;
    
    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");

    const volume = Number(args[0]);
    
    if (!volume || volume < 1 || volume > 100) return message.reply("Você deve dizer um volume entre 1 e 100.");

    player.setVolume(volume);
    return message.reply(`Volume do Player definido em: \`${volume}\`.`);
  }
}