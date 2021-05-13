const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'embed',
      category: 'Developer Tools',
      aliases: [''],
      usage: '',
      description: 'Teste de Embeds',
      ownerOnly: true,

    });
  }

  async run(client, message, args) {
    const embed = await message.channel.send(
        new Discord.MessageEmbed()
            .setAuthor(eval(client.embed.botauthortag), eval(client.embed.botauthoricon))
            .setColor(client.embed.color)
    )
    // const embed = new Discord.MessageEmbed()
    //   .setAuthor(client.user.tag, client.user.displayAvatarURL())
    //   .setColor(client.embed.color)
    // const Embed = await message.channel.send(embed)

    // Embed.react("👌")
    // const Timer = 60000
    // const DedoFilter = (reaction, user) => reaction.emoji.name === "👌" && message.author.id === user.id
    // const DedoCollector = message.createReactionCollector(DedoFilter, { time: Timer });
    // DedoCollector.on("collect", reaction => {
    //   Embed.edit(embed.setDescription("Reagiu Editei"))
    // })
      

  }
}