const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const say = require("say");
const Voice = require("../../Tools/Voices");

module.exports = class VoiceTTSCommand extends BaseCommand {
  constructor() {
    super(
      "vts", //name
      "Interaction", //category
      ["voicesay"], //aliases
      "vts <Palavra/Frase>", //usage
      "Tudo oque você digitar o bot irá falar no chat de voz" //description
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

      say.speak(`${args}`, Voice.Windows.Maria, 1, (err) => {
        if(err) {
          return console.error(err);
        }
      });

      say.getInstalledVoices((err, voices) => console.log(voices))

    } else {
      message.delete().catch((O_o) => {});
      message.channel.send(
        "Por Favor conecte-se a um na canal de voz para utilizar este comando!"
      );
    }
  }
};
