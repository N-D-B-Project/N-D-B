const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ClearQueueCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "clearqueue",
      category: "Music",
      aliases: ["cq", "limparlista", "limparfila"],
      usage: "",
      description: "Limpa a lista de musicas"
    });
  }

  async run(client, message, args) {
    const player = client.music.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
    });

    if (player.state !== "CONNECTED") player.connect();

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
    if (!player.queue) return message.reply("A fila já está vazia");

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Limpar Fila?")
      .setDescription("Você realmente quer limpar a fila?")
      .addFields(
        { name: "Sim", value: "✅", inline: true },
        { name: "Não", value: "❎", inline: true }
      )
      .setThumbnail()
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send(embed).then(async (msg) => {
      await msg.react("✅");
      await msg.react("❎");

      const filter = (reaction, user) =>
        reaction.emoji.name === `✅` ||
        (reaction.emoji.name === `❎` && user.id === call.message.author.id);
      const collector = msg.createReactionCollector(filter, { time: 30000 });

      collector.on("collect", (reaction, user) => {
        try {
          if (reaction.emoji.name === "✅") {
            player.queue.clear().then(() => {
              message.channel.send("Fila limpada");
            });
          } else if (reaction.emoji.name === "❎") {
            message.channel.send("Comando Cancelado");
          } else {
            collector.stop();
          }
        } catch (err) {
          message.channel.send("Algum erro impediu-me de limpar a fila");
          console.log(err)
        }
      });
    });
  }
};
