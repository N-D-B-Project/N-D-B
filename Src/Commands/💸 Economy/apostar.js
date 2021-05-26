const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const Cash = require("../../Database/Schema/NDCash");

module.exports = class ApostarCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "apostar",
      category: "💸 Economy",
      aliases: ["gamble"],
      usage: "apostar <Quantidade>",
      description: "Aposte seu dinheiro e tenha chaçe de dobrar seu dinheiro"
    });
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
          message.reply(await client.translate(
            "Você ainda não possui uma conta NDCash! Utilize o comando criar para criar sua conta!", message
          ));
        } else if (cash) {
          if (cash.ndcash <= 0)
            return message.reply(await client.translate(
              "Você não possui dinheiro para fazer uma aposta", message
            ));
          if (!args[0])
            return message.reply(await client.translate("Por favor diga o quanto você quer apostar", message));
          if (!Number.isInteger(parseInt(args[0])))
            return message.reply(await client.translate(
              "Você não pode apostar um número não inteiro!", message
            ));
          if (cash.ndcash < aposta)
            return message.reply(await client.translate(
              "Você não possui dinheiro suficiente para apostar", message
            ));

          if (wl == "l") {
            cash.ndcash -= aposta;
            cash.save().catch((err) => console.error(err));
            const PerdeuEmbed = new Discord.MessageEmbed()
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ size: 4096, dynamic: true })
              )
              .setColor("#00c26f")
              .setTitle(await client.translate("Perdeu a Aposta 😢", message))
              .setDescription(await client.translate(
                `Você perdeu a aposta. Você possui agora: ${cash.ndcash}`, message
              ))
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
              .setTitle(await client.translate("Ganhou a Aposta!", message))
              .setDescription(await client.translate(
                `Você ganhou a aposta! Você possui agora: ${cash.ndcash}`, message
              ))
              .setFooter(client.user.tag, client.user.displayAvatarURL())
              .setTimestamp();
            message.channel.send(GanhouEmbed);
          }
        }
      });
  }
};
