const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class ShuffleCommand extends BaseCommand {
  constructor() {
    super("shuffle", "music", []);
  }

  async run(client, message, args) {
    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);

    if (channel && player) {
      if (channel.id === player.voiceChannel.id) {
        player.queue.shuffle();
        message.channel.send("Fila embaralhada!");
      }
    }
  }
};
