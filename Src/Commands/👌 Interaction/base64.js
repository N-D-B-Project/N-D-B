const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'base64',
      category: '👌 Interaction',
      aliases: [''],
      usage: 'base64 <encode/decode> <texto>',
      description: 'Encripta ou Decripta um texto em Base64',
      disable: true
    });
  }

  async run(client, message, args) {
    let text = args.join(" ");
        if (args[0] == 'encode') {

            message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(Buffer.from(text).toString('base64'))
                )
        } else if (args[0] == 'decode') {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(Buffer.from(text, 'base64').toString('ascii'))
            )
        }
  }
}