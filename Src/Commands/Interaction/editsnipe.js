const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class TestCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'editsnipe', //name
      category: 'Interacion', //category
      aliases: ['esnipe'], //aliases
      usage: '', //usage
      description: 'Mostra a ultima mensagem editada no canal', //description
    });
  }

  async run(client, message, args) {
      message.channel.send("Comando Desabilitado")
    // const msg = client.editSnipe.get(message.channel.id)
    // if(!msg) return message.channel.send("Nenhuma Mensagem editada")
    // const embed = new Discord.MessageEmbed()
    //   .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
    //   // .setDescription(msg.content)
    // //   .addFields(
    // //     { name: "Messagem Antiga", content: msg.content},
    // //     { name: "Messagem Editada", content: msg.content}
    // //   )
    //     .addFields(
    //         { name: "Messagem Antiga", content: msg.OldContent},
    //         { name: "Messagem Editada", content: msg.NewContent}
    //     )
    //   .setColor("#00c26f")
    //   .setFooter("Mensagem Editada")
    //   .setTimestamp()
    // if(msg.image)embed.setImage(msg.image)
    

    // message.channel.send(embed)
  }
}


