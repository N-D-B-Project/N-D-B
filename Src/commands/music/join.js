const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.js");

module.exports = class JoinCommand extends BaseCommand {
  constructor() {
    super(
      'join', //name
      'Music', //category
      ['entrar', 'entre', 'enter'], //aliases
      '', //usage
      'Faz com que o Bot entre na call' //description
    );
  }

  async run(client, message, args) {
    const { channel } = message.member.voice;
    if (channel) {
      const player = client.music.players.spawn({
        guild: message.guild,
        voiceChannel: channel,
        textChannel: message.channel,
      });
      //client.musicPlayers.set(message.guild.id, player);
      //console.log(client.musicPlayers);
      //console.log("Conectado em um canal de voz.");
    } else {
      message.delete().catch((O_o) => {});
      message.channel.send(
        "Por Favor conecte-se a um na canal de voz para utilizar este comando!"
      );
    }
  }
};
