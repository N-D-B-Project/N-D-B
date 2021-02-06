const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class SayCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'say',
      category: 'Moderation',
      aliases: ['dizer', 'diga', 'falar', 'fale'],
      usage: 'say <Mensagem a ser dita pelo Bot>',
      description: 'O Bot apaga sua mensagem e reenvia ela'
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
