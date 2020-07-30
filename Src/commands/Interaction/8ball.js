const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class eightball extends BaseCommand {
  constructor() {
    super("8ball", "bola8", "bolaoito", []);
  }

  async run(client, message, args) {
    if (!args[0]) return message.reply("Você não perguntou nada!");
    let replies = [
      "Sim",
      "Não",
      "Definitivamente sim",
      "Definitivamente não",
      "Dimi viado",
      "Não sei responder a esta pergunta",
    ];

    let result = Math.floor(Math.random() * replies.length);
    let question = args.slice(0).join(" ");

    let Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag)
      .setTitle(`8Ball!`)
      .setColor(`RANDOM`)
      .addField("Pergunta", question)
      .addField("Resposta", replies[result]);

    message.channel.send(Embed);
  }
};
