const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Cash = require("../../database/schemas/NDCash");

module.exports = class ContaCommand extends BaseCommand {
  constructor() {
    super(
      "pay", //name
      "Economy", //category
      ["pagar"], //aliases
      "pay <Mencione um usuário> <Valor>", //usage
      "Doa NDCash (dinheiro) para outro usuário" //description
    );
  }
  async run(client, message, args) {
    const Payment = parseInt(args[1]);

    if(!args[0]) return message.reply("Mencione o Usuário o qual que dar NDCash")
    
    const Mention = message.mentions.members.first() || client.users.cache.get(args[0]);

    if(!Mention) return message.reply("Não encontrei esse usuário");
  
    if(Mention.id === message.author.id) return message.reply("Você não pode dar dinheiro para você mesmo");
    
    Cash.findOne({ userId: message.author.id }, async (err, cash) => {
      if (!cash) {
        if (err) console.error("Economy Error: " + err);
        message.reply(
          "Você Não possui uma conta NDCash! Para criar-lá utilize o comando criar!"
        );
      } else {
        Cash.findOne({ userId: Mention.id}, async (err, mcash) => {
            if (err) console.log(err);

            if(!args[0]) return message.reply("Mencione o Usuário o qual que dar NDCash")

            if(!args[1])
              return message.reply("Diga quanto você quer dar");

            if(!Number.isInteger(parseInt(args[1])))
              return message.reply("Você não pode dar números não inteiros");

            if(parseInt(args[1]) > cash.ndcash)
              return message.reply("Você não tem dinheiro suficiente para dar");

            if(parseInt(args[1]) < 1)
              return message.reply("Você não pode dar menos que N¥1");

            if(!mcash) {
            return message.reply("Esse usuário não possui uma conta NDCash portanto você não pode dar dinheiro para ele(a)")
            } else {
                mcash.ndcash += Payment;
                cash.ndcash -= Payment;
                mcash.save().catch((err) => console.log(err));
                cash.save().catch((err) => console.log(err));
            } return message.channel.send(`${message.author} deu N¥${args[1]} para ${Mention}`)
        }); 
    }
    });
  }
};
