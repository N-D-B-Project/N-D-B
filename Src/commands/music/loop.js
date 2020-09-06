const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class LoopCommand extends BaseCommand {
  constructor() {
    super("loop", "music", []);
  }

  async run(client, message, args) {
    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);

    if (channel && player) {
      if (channel.id === player.voiceChannel.id) {
        player.setQueueRepeat(!player.queueRepeat);
        message.delete().catch((O_o) => {});
        message.channel.send(
          `Fila em loop ${player.queueRepeat ? "Ativada" : "Desativada"}!`
        );
      }
    }
  }
};
