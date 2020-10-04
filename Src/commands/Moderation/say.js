const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.js");

module.exports = class SayCommand extends BaseCommand {
  constructor() {
    super(
      'say', //name
      'Moderation', //category
      ['dizer', 'diga', 'falar', 'fale'], //aliases
      'say <Mensagem a ser dita pelo Bot>', //usage
      'O Bot apaga sua mensagem e reenvia ela' //description
    );
  }

  async run(client, message, args) {
    //if (message.author.id === 330047048009252864) {
    const sayMessage = args.join(" ");
    message.delete().catch((O_o) => {});
    message.channel.send(sayMessage);
    //} else {
    //message.channel.send("Somente meu Dono pode usar este comando seu Corno");
    //}
  }
};
