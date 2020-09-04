const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

let USED = false;

module.exports = class skipp extends BaseCommand {
  constructor() {
    super("skipp", "music", []);
  }

  async run(client, message, args) {
    const guildId = message.guild.id;
    const player = client.music.players.get(guildId);
    const { channel } = message.member.voice;
    if (player && channel) {
      if (player.voiceChannel.id === channel.id) {
        const members = channel.members.filter((m) => !m.user.bot);
        //console.log(members.size);
        if (members.size === 1) {
          player.stop();
          message.channel.send(`Pulando Musica... ${player.queue[0].title}`);
        } else {
          if (!USED) {
            USED = true;
            const voteRequired = Math.ceil(members.size * 0.6);
            const embed = new Discord.MessageEmbed()
              .setAuthor(client.user.tag, client.user.displayAvatarURL())
              .setTitle("Pular musica")
              .setDescription(
                `Total de votos necessários para pular a musica: ${voteRequired}`
              )
              .setColor("#00c26f");
            const msg = await message.channel.send(embed);
            await msg.react("✅");
            await msg.react("❌");

            const filter = (reaction, user) => {
              if (user.bot) return false;
              const { channel } = message.guild.members.cache.get(
                user.id
              ).voice;
              if (channel) {
                if (channel.id === player.voiceChannel.id) {
                  return ["✅"].includes(reaction.emoji.name);
                }
                return false;
              } else {
                return false;
              }
            };

            try {
              const reactions = await msg.awaitReactions(filter, {
                max: voteRequired,
                time: 10000,
                errors: ["time"],
              });
              //console.log(reactions);
              const totalVotes = reactions
                .get("✅")
                .users.cache.filter((u = !u.bot));
              //console.log(totalVotes.size);
              if (totalVotes.size >= voteRequired) {
                player.stop();
                USED = false;
              }
            } catch (err) {
              //console.log(err);
              USED = false;
            }
          } else {
            message.channel.send(
              "Este comando não pode ser utilizado neste momento"
            );
          }
        }
      }
    }
  }
};
