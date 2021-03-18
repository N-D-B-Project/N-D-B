const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class HowGayCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'howgay',
      category: 'Interaction',
      aliases: ['HowGay'],
      usage: 'HowGay <Mencione um usuário>',
      description: 'Diz o quão gay é o usuário mencionado'
    });
  }

  async run(client, message, args) {
    const porcentagem = Math.floor(Math.random() * 101);

    if(!args[0]) { 
      var Mention = message.author;
    } else {
      var Mention = message.mentions.users.first() || client.users.cache.get(args[0]);
    }

    message.channel.send(`${Mention} é ${porcentagem}% Gay`)
  }
}