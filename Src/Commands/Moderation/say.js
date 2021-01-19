const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class SayCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'say', //name
      category: 'Moderation', //category
      aliases: ['dizer', 'diga', 'falar', 'fale'], //aliases
      usage: 'say <Mensagem a ser dita pelo Bot>', //usage
      description: 'O Bot apaga sua mensagem e reenvia ela' //description
    });
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
