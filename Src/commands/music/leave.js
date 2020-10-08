const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class LeaveCommand extends BaseCommand {
  constructor() {
    super(
      'leave', //name
      'Music', //category
      ['sair'], //aliases
      '', //usage
      'Faz com que o bot saia ca call' //description
    );
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
