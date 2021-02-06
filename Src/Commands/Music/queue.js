const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class QueueCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'queue',
      category: 'Music',
      aliases: ['fila', 'lista'],
      usage: '',
      description: 'Mostra a lista de musicas que serão tocadas'
    });
  }

  async run(client, message, args) {
    const player = message.client.music.players.get(message.guild.id);
    //if (!player) return message.reply("Player não iniciado nesse servidor");
    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: Player não iniciado em", `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    ////

    const queue = player.queue;
    const embed = new Discord.MessageEmbed().setAuthor(`Lista do server: ${message.guild.name}`);

    if(queue.current) embed.addField("Tocando Agora: ", `[${queue.current.title}](${queue.current.uri})`);

    const multiple = 10;
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if(!tracks.length) embed.setDescription(`Sem musicas ${page > 1 ? `Pagina ${page}` : "Lista:"}.`);
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter(`Pagina ${page > maxPages ? maxPages : page} / ${maxPages}`);

    return message.reply(embed);
  }
}