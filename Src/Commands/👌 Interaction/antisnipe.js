const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'antisnipe',
      category: '👌 Interaction',
      aliases: ['asnipe'],
      usage: '',
      description: 'Oculta o Snipe da ultima mensagem apagada ou editada',
    });
  }

  async run(client, message, args) {
    client.snipe.set(message.channel.id, {
        check:false,
        content:null,
        author:null,
        image:null
    })
    client.editSnipe.set(message.channel.id, {
        check:false,
        OldContent:null,
        NewContent:null,
        author:null,
        image:null
    })
    message.inlineReply("Mensagem Ocultada!")
  }
}