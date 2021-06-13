const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class EightBallCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: '8ball',
      category: '👌 Interaction',
      aliases: ['eightball'],
      usage: '8ball <Sua Pergunta>',
      description: 'O Bot responde sua pergunta com algo aleatório'
    });
  }

  async run(client, message, args, tools) {
    if (!args[0]) return message.reply("Você não perguntou nada!");

    let result = Math.floor(Math.random() * tools.replies.length);
    let question = args.slice(0).join(" ");

    let Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`🎱 8Ball!`)
      .setColor("#00c26f")
      .addField("❔ Pergunta", question, true)
      .addField("🗣 Resposta", tools.replies[result], true)
      .setTimestamp()
    message.delete()
    message.channel.send(Embed);
  }
};
