const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class TestCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'snipe',
      category: 'Interacion',
      aliases: [''],
      usage: '',
      description: 'Mostra a ultima mensagem deletada no canal',
    });
  }

  async run(client, message, args) {
    const msg = client.snipe.get(message.channel.id)
    if(!msg) return message.channel.send(await client.translate("Nenhuma Mensagem deletada", message))
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(msg.content)
      .setColor("#00c26f")
      .setFooter(await client.translate("Mensagem Apagada", message))
      .setTimestamp()
    if(msg.image)embed.setImage(msg.image)
    

    message.channel.send(embed)
  }
}


