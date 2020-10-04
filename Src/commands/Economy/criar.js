const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const AB = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Profile = require("../../database/schemas/Profile.js");

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

    Profile.findOne ({ userId: message.author.id, },
      async (err, profile) => {
        if(err) console.error("Economy Error: " + err);
        if(!profile) {
          const newProfile = new Profile({
            username: message.author.tag,
            userId: message.author.id,
            ndcash: 0,
            propina: 0,
            emprego: "Desempregado",
            skin: "Default",
          });
          newProfile.save().catch((err) => console.error("newProfile Err: " + err));
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