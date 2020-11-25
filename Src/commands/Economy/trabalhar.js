const BaseCommand = require("../../utils/structures/BaseCommand");
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
      name: "trabalhar", //name
      category: "Economy", //category
      aliases: ["work"], //aliases
      usage: "", //usage
      description: "Trabalhe para ganhar NDCash (dinheiro)" //description
    });
  }

  async run(client, message, args) {
    const Cash = require("../../database/schemas/NDCash");

    const reward = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    
    const daily = 86400000;
    // reward = reward[Math.floor(Math.random() * reward.length)];
    const premio = reward[Math.floor(Math.random() * reward.length)];

    Cash.findOne({userId: message.author.id,}, async (err, cash) => {
        if(!cash) {
          if (err) console.log("Economy Error: " + err);
          message.reply("Você ainda não possui uma conta NDCash! Utilize o comando criar para criar sua conta!");
        } else if(cash) {
          if(daily - (Date.now() - cash.daily) > 0) {
            const time = ms(daily - (Date.now() - cash.daily));
            const embed = new Discord.MessageEmbed()
              .setColor("#00c26f")
              .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 4096, dynamic: true }))
              .setTitle("Você já trabalhou hoje!")
              .setDescription(`Você pode trabalhar novamente em ${time.hours}h  ${time.minutes}m ${time.seconds}s`);
            return message.channel.send(embed);
          } else {
            cash.ndcash += premio;

            cash.daily = Date.now();

            cash.save().catch((err) => console.log(err));
            const embed = new Discord.MessageEmbed()
              .setColor("#00c26f")
              .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 4096, dynamic: true }))
              .setTitle("Trabalho!")
              .setImage("https://i.imgur.com/mS6maZD.jpg")
              .setDescription(`Você recebeu N¥${premio} pelo seu trabalho!`);
            return message.channel.send(embed);
          }
        }
      }
    );
  }
};
