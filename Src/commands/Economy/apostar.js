const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const mongoose = require("mongoose");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Cash = require("../../database/schemas/NDCash");

module.exports = class ApostarCommand extends BaseCommand {
  constructor() {
    super(
      "apostar", //name
      "Economy", //category
      ["gamble"], //aliases
      "apostar <Quantidade>", //usage
      "Aposte seu dinheiro e tenha chaçe de dobrar seu dinheiro" //description
    );
  }

  async run(client, message, args) {
    //const aposta = args[0];
    const aposta = parseInt(args[0]);
    const wlo = ["w", "l"];
    const wl = wlo[Math.floor(Math.random() * wlo.length)];
    
    Cash.findOne({ userId: message.author.id },
      async (err, cash) => {
        if (err) console.log("Economy Error: " + err);
        if (!cash) {
          message.reply(
            "Você ainda não possui uma conta NDCash! Utilize o comando criar para criar sua conta!"
          );
        } else if (cash) {
          if (cash.ndcash <= 0)
            return message.reply(
              "Você não possui dinheiro para fazer uma aposta"
            );
          if (!args[0])
            return message.reply("Por favor diga o quanto você quer apostar");
          if (!Number.isInteger(parseInt(args[0])))
            return message.reply(
              "Você não pode apostar um número não inteiro!"
            );
          if (cash.ndcash < aposta)
            return message.reply(
              "Você não possui dinheiro suficiente para apostar"
            );

          if (wl == "l") {
            cash.ndcash -= aposta;
            cash.save().catch((err) => console.error(err));
            const PerdeuEmbed = new Discord.MessageEmbed()
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ size: 4096, dynamic: true })
              )
              .setColor("#00c26f")
              .setTitle("Perdeu a Aposta ;-;")
              .setDescription(
                `Você perdeu a aposta. Você possui agora: ${cash.ndcash}`
              )
              .setFooter(client.user.tag, client.user.displayAvatarURL())
              .setTimestamp();
            message.channel.send(PerdeuEmbed);
          } else if (wl == "w") {
            cash.ndcash += aposta;
            cash.save().catch((err) => console.error(err));
            const GanhouEmbed = new Discord.MessageEmbed()
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ size: 4096, dynamic: true })
              )
              .setColor("#00c26f")
              .setTitle("Ganhou a Aposta!")
              .setDescription(
                `Você ganhou a aposta! Você possui agora: ${cash.ndcash}`
              )
              .setFooter(client.user.tag, client.user.displayAvatarURL())
              .setTimestamp();
            message.channel.send(GanhouEmbed);
          }
        }
      });
  }
};
