const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.js");

module.exports = class ShuffleCommand extends BaseCommand {
  constructor() {
    super(
      'shuffle', //name
      'Music', //category
      ['misturar'], //aliases
      '', //usage
      'Põe em ordem aleatória as musicas da fila' //description
    );
  }

  async run(client, message, args) {
    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);

    if (channel && player) {
      if (channel.id === player.voiceChannel.id) {
        player.queue.shuffle();
        message.delete().catch((O_o) => {});
        message.channel.send("Fila embaralhada!");
      }
    }
  }
};
