const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class EightBallCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: '8ball', //name
      category: 'Interaction', //category
      aliases: ['eightball'], //aliases
      usage: '8ball <Sua Pergunta>', //usage
      description: 'O Bot responde sua pergunta com algo aleatório' //description
    });
  }

  async run(client, message, args) {
    if (!args[0]) return message.reply("Você não perguntou nada!");
    const replies = require("../../Tools/replies");

    let result = Math.floor(Math.random() * replies.length);
    let question = args.slice(0).join(" ");

    let Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`8Ball!`)
      .setColor(`RANDOM`)
      .addField("Pergunta", question)
      .addField("Resposta", replies[result]);
    message.delete().catch((O_o) => {});
    message.channel.send(Embed);
  }
};
