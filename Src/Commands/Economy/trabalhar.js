const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const mongoose = require("mongoose");
const ms = require("parse-ms");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class TrabalharCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "trabalhar",
      category: "Economy",
      aliases: ["work"],
      usage: "",
      description: "Trabalhe para ganhar NDCash (dinheiro)"
    });
  }

  async run(client, message, args) {
    const Cash = require("../../Database/Schemas/NDCash");

    const reward = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    
    const daily = 86400000;
    // reward = reward[Math.floor(Math.random() * reward.length)];
    const premio = reward[Math.floor(Math.random() * reward.length)];

    Cash.findOne({userId: message.author.id,}, async (err, cash) => {
        if(!cash) {
          if (err) console.log("Economy Error: " + err);
          message.reply(await client.translate("Você ainda não possui uma conta NDCash! Utilize o comando criar para criar sua conta!", message));
        } else if(cash) {
          if(daily - (Date.now() - cash.daily) > 0) {
            const time = ms(daily - (Date.now() - cash.daily));
            const embed = new Discord.MessageEmbed()
              .setColor("#00c26f")
              .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 4096, dynamic: true }))
              .setTitle(await client.translate("Você já trabalhou hoje!", message))
              .setDescription(await client.translate(`Você pode trabalhar novamente em ${time.hours}h  ${time.minutes}m ${time.seconds}s`, message));
            return message.channel.send(embed);
          } else {
            cash.ndcash += premio;

            cash.daily = Date.now();

            cash.save().catch((err) => console.log(err));
            const embed = new Discord.MessageEmbed()
              .setColor("#00c26f")
              .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 4096, dynamic: true }))
              .setTitle(await client.translate("Trabalho!", message))
              .setImage("https://i.imgur.com/mS6maZD.jpg")
              .setDescription(await client.translate(`Você recebeu N¥${premio} pelo seu trabalho!`, message));
            return message.channel.send(embed);
          }
        }
      }
    );
  }
};
