const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'seek',
      category: 'Music',
      aliases: [''],
      usage: 'seek <Momento em segundos>',
      description: 'Muda a duração da musica',
    });
  }

  async run(client, message, args) {
    const player = message.client.music.players.get(message.guild.id);

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

    const { channel } = message.member.voice;

    if (!channel) return message.reply("Você não está em um canal de voz");
    if (channel.id !== player.voiceChannel)
      return message.reply("Você não está no mesmo canal de voz");

      if(Number(args[0]) <= 0 || Number(args[0]) >= player.queue.current.duration/1000) 
        return message.channel.send(
            new Discord.MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`You may set the volume \`1\` - \`${player.queue.current.duration}\``)
        );
      player.seek(Number(args[0])*1000);
      const embed = new Discord.MessageEmbed()
        .setTitle(`✅ Posição da musica: ${format(Number(args[0])*1000)}`)
        .addField("Progresso: ", "**[" + createBar((player.queue.current.duration == 0 ? player.position : player.queue.current.duration), player.position, 25, "▬", "🔶")[0] + "]**\n**" + new Date(player.position).toISOString().substr(11, 8) + " / " + (player.queue.current.duration == 0 ? " ◉ LIVE" : new Date(player.queue.current.duration).toISOString().substr(11, 8))+ "**")
        .setColor("#00c26f")
        .setFooter(client.user.tag, client.user.displayAvatarURL())
      return message.channel.send(embed);
  }
}

const createBar = (total, current, size = 25, line = '▬', slider = '🔶') => current > total ? [line.repeat(size * 2), (current / total) * 100] : [line.repeat(Math.round(size * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total))), current / total];
function format(millis){
  var h=Math.floor(millis/360000),m=Math.floor(millis/60000),s=((millis%60000)/1000).toFixed(0);
  if(h<1) return(m<10?'0':'')+m+":"+(s<10?'0':'')+s;
  else return(h<10?'0':'')+h+":"+(m<10?'0':'')+m+":"+(s<10?'0':'')+s;
  }