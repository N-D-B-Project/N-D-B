const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class TestCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'snipe',
      category: '👌 Interaction',
      aliases: [''],
      usage: '',
      description: 'Mostra a ultima mensagem deletada no canal',
    });
  }

  async run(client, message, args) {
    const msg = client.snipe.get(message.channel.id)
    if(!msg) return message.channel.send("Nenhuma Mensagem deletada")
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(msg.content)
      .setColor("#00c26f")
      .setFooter("Mensagem Apagada")
      .setTimestamp()
    if(msg.image)embed.setImage(msg.image)
    

    message.channel.send(embed)
  }
}


