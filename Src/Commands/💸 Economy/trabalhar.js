const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const ms = require("parse-ms");
const Cash = require("../../Database/Schema/NDCash");

module.exports = class TrabalharCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "trabalhar",
      category: "💸 Economy",
      aliases: ["work"],
      usage: "",
      description: "Trabalhe para ganhar NDCash (dinheiro)"
    });
  }

  async run(client, message, args) {
    //const reward = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    
    // reward = reward[Math.floor(Math.random() * reward.length)];
    //const premio = reward[Math.floor(Math.random() * reward.length)];

    Cash.findOne({ userId: message.author.id, }, async (err, cash) => {
      var reward
      switch (cash.emprego) {
        case "Desempregado":
          reward = cash.level * 100;
        break;
        case "Professor":
          reward = cash.level * 200 + 200;
        break;
      }
    
      var daily 
      switch (cash.x2time) {
        case false:
          daily = 86400000;
        break;
        case true:
          daily = 43200000;
        break;
      }
        if(daily - (Date.now() - cash.daily) > 0) {
          const time = ms(daily - (Date.now() - cash.daily));
          const embed = new Discord.MessageEmbed()
            .setColor("#00c26f")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 4096, dynamic: true }))
            .setTitle("Você já trabalhou hoje!")
            .setDescription(`Você pode trabalhar novamente em ${time.hours}h  ${time.minutes}m ${time.seconds}s`);
          return message.channel.send(embed);
        } else {
          
          if(cash.worked === 10) {
            cash.worked = 0
            cash.level += 1
            message.channel.send("Você subiu de nivel!")
          }
          cash.ndcash += reward; //premio;
          cash.worked += 1;
          cash.daily = Date.now();
          cash.save().catch((err) => client.logger.error(err));
          const lvlup = cash.worked - 10;
          const embed = new Discord.MessageEmbed()
            .setColor("#00c26f")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 4096, dynamic: true }))
            .setTitle("Trabalho!")
            .setImage("https://i.imgur.com/mS6maZD.jpg")
            .setDescription(`Você recebeu N¥${reward} pelo seu trabalho!`)
            .setFooter(`Trabalhe mais ${Number.isInteger(parseInt(lvlup))} para subir de nível e receber mais!`)
            .setTimestamp();
          return message.channel.send(embed);
        }
      }
    );
  }
};
