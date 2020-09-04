const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

const selections = new Set();
const constants = ["queueall", "stopselect"];

module.exports = class SearchCommand extends BaseCommand {
  constructor() {
    super("search", "music", []);
  }

  async run(client, message, args) {
    const query = args.join(" ");
    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);
    if (channel && player) {
      if (channel.id === player.voiceChannel.id) {
        const searchResults = await client.music.search(query, message.author);
        const tracks = searchResults.tracks.slice(0, 10);
        let i = 0;
        const tracksInfo = tracks.map(
          (track) => `${++i}) [${track.title}](${track.uri})`
        );
        const embed = new Discord.MessageEmbed()
          .setAuthor(client.user.tag, client.user.displayAvatarURL())
          .setDescription(tracksInfo)
          .setFooter("Resultados");

        message.channel.send(embed);
        const filter = (m) =>
          m.author.id === message.author.id &&
          channel.id === player.voiceChannel.id &&
          ((m.content >= 1 && m.content <= tracks.length) ||
            constants.includes(m.content.toLowerCase()));

        const collector = message.channel.createMessageCollector(filter);
        const tracksToQueue = await handleCollector(collector, tracks);

        i = 0;
        const selectedTracksInfo = tracksToQueue.map(
          (track) => `${++i}) [${track.title}](${track.uri})`
        );
        const selectedTracksEmbed = new Discord.MessageEmbed()
          .setAuthor(client.user.tag, client.user.displayAvatarURL())
          .setDescription(selectedTracksInfo);

        const msg = await message.channel.send(
          "Confirme ✅ ou Recuse ❌",
          selectedTracksEmbed
        );
        await msg.react("✅");
        await msg.react("❌");

        try {
          const reactionFilter = (reaction, user) =>
            ["✅", "❌"].includes(reaction.emoji.name) &&
            user.id === message.author.id;
          const reactions = await msg.awaitReactions(reactionFilter, {
            max: 1,
            time: 15000,
            errors: ["time"],
          });
          const selectedReaction = reactions.get("✅") || reactions.get("❌");
          if (selectedReaction.emoji.name === "✅") {
            for (const track of tracksToQueue) {
              player.queue.add(track);
              //console.log(`${track.title} posto na fila.`)
            }
            if (!player.playing) player.play();
          } else {
            message.channel.send("Cancelado. Nenhuma musica colocada na fila.");
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      message.channel.send("Você não está conectado a um canal de voz.");
    }
  }
};

function handleCollector(collector, tracks) {
  const tracksToQueue = [];
  return new Promise((resolve, reject) => {
    try {
      collector.on("collect", (message) => {
        if (message.content.toLowerCase() === "queueall") {
          collector.stop();
          selections.clear();
          resolve(tracks);
        } else if (message.content.toLowerCase() === "stopselect") {
          collector.stop();
          selections.clear();
          resolve(tracksToQueue);
        } else {
          const entry = message.content;
          //console.log(selections);
          if (selections.has(entry)) {
            message.channel.send("Você já selecionou essa música!");
          } else {
            message.channel.send(`You selected: ${tracks[entry - 1].title}`);
            tracksToQueue.push(tracks[entry - 1]);
            selections.add(entry);
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
