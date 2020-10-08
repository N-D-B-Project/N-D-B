const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class LoopCommand extends BaseCommand {
  constructor() {
    super(
      'loop', //name
      'Music', //category
      ['ciclo'], //aliases
      '', //usage
      'Liga ou desliga o loop da fila' //description
    );
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
