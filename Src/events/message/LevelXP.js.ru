// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
const BaseEvent = require('../../utils/structures/BaseEvent');
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../Config/Abbreviations");
const Levels = require("discord-xp");
const ProfileXP = require("../../database/schemas/ProfileXP");
const GuildConfig = require("../../database/schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    })
    const FindChannel = guildConfig.XpChannelId;
    const Channel = client.channels.cache.get(`${FindChannel}`);
    const target = message.author;
    const randomXp = Math.floor(Math.random() * 9) + 1;
    const LevelUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
    if(LevelUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      Channel.send(`${target} Você subiu de Nível! Seu novo nível é **${user.level}**!!`);
    }
  }
}
//https://www.youtube.com/watch?v=QBJxC-tJK8Y