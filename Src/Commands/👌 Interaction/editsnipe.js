const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'editsnipe',
      category: '👌 Interaction',
      aliases: ['esnipe'],
      usage: '',
      description: 'Mostra a ultima mensagem editada no canal',
    });
  }

  async run(client, message, args) {
    const msg = client.editSnipe.get(message.channel.id)
    if(!msg || msg.check === false) return message.channel.send("Nenhuma Mensagem editada")
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .addFields( 
          { name: 'Mensagem Antiga', value: msg.OldContent },
          { name: 'Mensagem Editada', value: msg.NewContent }
      )
      .setColor("#00c26f")
      .setFooter("Mensagem Editada")
      .setTimestamp()
    if(msg.image)embed.setImage(msg.image)
    message.inlineReply(embed)
  }
}