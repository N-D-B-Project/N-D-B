const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class leave extends BaseCommand {
  constructor() {
    super("leave", "music", []);
  }

  async run(client, message, args) {
    const { id } = message.guild;
    const player = client.music.players.get(id);
    //console.log(player);
    const { channel } = message.member.voice;
    if (player && channel) {
      if (player.voiceChannel.id === channel.id) {
        client.music.players.destroy(id);
      }
    }
  }
};
