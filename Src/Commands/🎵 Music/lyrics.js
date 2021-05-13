const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class LyricsCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
        name: 'lyrics',
        category: '🎵 Music',
        aliases: ['ly', 'letra'],
        usage: '',
        description: 'Mostra a Letra da musica que está tocando'
    });
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
    const player = client.music.players.get(message.guild.id);
    //console.log(player);
    // if(!player) return message.reply("player não iniciado nesse servidor");
    if(!player) return message.channel.send(PlayerEmbed)

    const { channel } = message.member.voice;
    
    if(!channel) return message.reply("Você não está em um canal de voz");
    if(channel.id !== player.voiceChannel) return message.reply("Você não está no mesmo canal de voz");
  
    const req = player.queue.current;

    let page = 0;
    let lyrics = await client.Tools.lyricsify(client, message, req, page);
    if (lyrics == null) return message.channel.send(`Couldn't find any lyrics for ${req.title}`);
    let msg = await message.channel.send(lyrics[page]);
    await msg.react("??");
    await msg.react("??");
    await msg.react("??");
    let filter = (reaction, user) => reaction.emoji.name === `??` || reaction.emoji.name === `??` || reaction.emoji.name === `??` && user.id === message.author.id;
    const collector = msg.createReactionCollector(filter, { time: 30000 });

    collector.on("collect", (reaction, user) => {
        try {
            if (reaction.emoji.name === "??" && embeds.length !== 1) {
                if (page - 1 >= 0) {
                    --page;
                    msg.edit("", embeds[page]);
                } else {
                    page = embeds.length + 1;
                    msg.edit("", embeds[page - 1]);
                }
            } else if (reaction.emoji.name === "??" && embeds.length !== 1) {
                if (page + 1 < embeds.length) {
                    ++page;
                    msg.edit("", embeds[page]);
                } else {
                    page = 1;
                    msg.edit("", embeds[0]);
                }
            } else if (reaction.emoji.name === "??") {
                msg.delete();
            }
        } catch (e) {
            
        }
    });
  }
}