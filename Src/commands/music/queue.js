const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class QueueCommand extends BaseCommand {
  constructor() {
    super("queue", "music", []);
  }

  async run(client, message, args) {
    const player = client.music.players.get(message.guild.id);
    if (player) {
      let currentPage = 0;
      const embeds = generateQueueEmbed(player.queue);
      const queueEmbed = await message.channel.send(
        `Pagina Atual: ${currentPage + 1}/${embeds.length}`,
        embeds[currentPage]
      );
      await queueEmbed.react("⬅️");
      await queueEmbed.react("➡️");
      await queueEmbed.react("❌");

      const filter = (reaction, user) =>
        ["⬅️", "➡️", "❌"].includes(reaction.emoji.name) &&
        message.author.id === user.id;
      const collector = queueEmbed.createReactionCollector(filter);

      collector.on("collect", async (reaction, user) => {
        // If there are 2 embeds.
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(
              `Pagina Atual: ${currentPage + 1}/${embeds.length}`,
              embeds[currentPage]
            );
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(
              `Pagina Atual: ${currentPage + 1}/${embeds.length}`,
              embeds[currentPage]
            );
          }
        } else {
          collector.stop();
          //console.log('Stopped collector..');
          await queueEmbed.delete();
        }
      });
    }
  }
};

function generateQueueEmbed(queue) {
  const embeds = [];
  let k = 10;
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current
      .map((track) => `${++j}) [${track.title}](${track.uri})`)
      .join("\n");
    const embed = new Discord.MessageEmbed().setDescription(
      `**[Musica Atual: ${queue[0].title}](${queue[0].uri})**\n${info}`
    );
    embeds.push(embed);
  }
  return embeds;
}
