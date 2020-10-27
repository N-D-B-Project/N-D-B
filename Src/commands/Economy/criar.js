const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Cash = require("../../database/schemas/NDCash");

module.exports = class CriarCommand extends BaseCommand {
  constructor() {
    super(
      'criar', //name
      'Economy', //category
      ['Create'], //aliases
      '', //usage
      'Cria sua conta na NDCash' //description
    );
  }

  async run(client, message, args) {

    Cash.findOne ({ userId: message.author.id, },
      async (err, cash) => {
        if(err) console.error("Economy Error: " + err);
        if(!cash) {
          const newCash = new Cash({
            username: message.author.tag,
            userId: message.author.id,
            ndcash: 0,
            propina: 0,
            emprego: "Desempregado",
            skin: "Default",
          });
          newCash.save().catch((err) => console.error("newCash Err: " + err));
          //console.log(`${message.author.tag} criou sua conta na NDCash!`);
          return message.reply(`Sua conta NDCash está criada! Utilize o comando conta!`);
        } else {
          //console.warn(`${message.author.tag} Tentou criar outra conta na NDCash`);
          return message.reply(`Você já possui uma conta NDCash! Utilize o comando conta!`);
        }
      }
    )
  }
}