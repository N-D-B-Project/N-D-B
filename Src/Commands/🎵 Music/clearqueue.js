const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ClearQueueCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "clearqueue",
      category: "🎵 Music",
      aliases: ["cq", "limparlista", "limparfila"],
      usage: "",
      description: "Limpa a lista de musicas"
    });
  }

  async run(client, message, args) {
    const player = client.music.players.get(message.guild.id);

    if (player.state !== "CONNECTED") player.connect();

    const PlayerEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle("Player")
      .addField(":no_entry_sign: " + await client.translate("Player não iniciado em", message), `${message.guild.name}`)
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp();
    ////
    // if(!player) return message.reply("player não iniciado nesse servidor");
    if(!player) return message.channel.send(PlayerEmbed);
    if(!args[0]) return message.channel.send(await client.translate(`Esses são os níveis disponíveis: `, message) `${levels}`)

    if (channel.id !== player.voiceChannel) return message.reply(await client.translate("Você não está no mesmo canal de voz.", message));

    if (!player.queue) return message.reply("A fila já está vazia");

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setTitle(await client.translate("Limpar Fila?", message))
      .setDescription("Você realmente quer limpar a fila?")
      .addFields(
        { name: await client.translate("Sim", message), value: "✅", inline: true },
        { name: await client.translate("Não", message), value: "❎", inline: true }
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
            message.channel.send("Comando Cancelado")
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
