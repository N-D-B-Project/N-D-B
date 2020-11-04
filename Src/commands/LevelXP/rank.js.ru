const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../Config/Abbreviations.js");
const Levels = require("discord-xp");
const ProfileXP = require("../../database/schemas/ProfileXP");
const GuildConfig = require("../../database/schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class RankCommand extends BaseCommand {
  constructor() {
    super(
      'rankk', //name
      'LevelXP', //category
      [''], //aliases
      '', //usage
      'Mostra o rank de LevelXP' //description
    );
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    })
    const FindChannel = guildConfig.XpChannelId;
    const Channel = client.channels.cache.get(`${FindChannel}`);

    const rawLeaderboard = await Levels.fetchLeaderboard(message.author.id, message.guild.id);
    if(rawLeaderboard.length < 1) return reply("Ninguém está no Rank ainda");

    const leaderboard = Levels.computeLeaderboard(client, rawLeaderboard);

    const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

    Channel.send(`${lb.join("\n\n")}}`)
  }
}