const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Cash = require("../../Database/Schemas/NDCash");

module.exports = class CriarCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'criar',
      category: 'Economy',
      aliases: ['Create'],
      usage: '',
      description: 'Cria sua conta na NDCash'
    });
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
          return message.reply(await client.translate(`Sua conta NDCash está criada! Utilize o comando conta!`, message));
        } else {
          //console.warn(`${message.author.tag} Tentou criar outra conta na NDCash`);
          return message.reply(await client.translate(`Você já possui uma conta NDCash! Utilize o comando conta!`, message));
        }
      }
    )
  }
}