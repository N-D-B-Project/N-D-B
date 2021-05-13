const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const Cash = require("../../Database/Schemas/NDCash");

module.exports = class ContaCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "pay",
      category: "💸 Economy",
      aliases: ["pagar"],
      usage: "pay <Mencione um usuário> <Valor>",
      description: "Doa NDCash (dinheiro) para outro usuário"
    });
  }
  async run(client, message, args) {
    const Payment = parseInt(args[1]);

    if(!args[0]) return message.reply(await client.translate("Mencione o Usuário o qual que dar NDCash", message))
    
    const Mention = message.mentions.members.first() || client.users.cache.get(args[0]);

    if(!Mention) return message.reply(await client.translate("Não encontrei esse usuário", message));
  
    if(Mention.id === message.author.id) return message.reply(await client.translate("Você não pode dar dinheiro para você mesmo", message));
    
    Cash.findOne({ userId: message.author.id }, async (err, cash) => {
      if (!cash) {
        if (err) console.error("Economy Error: " + err);
        message.reply(await client.translate(
          "Você Não possui uma conta NDCash! Para criar-lá utilize o comando criar!", message
        ));
      } else {
        Cash.findOne({ userId: Mention.id}, async (err, mcash) => {
            if (err) console.log(err);

            if(!args[0]) return message.reply(await client.translate("Mencione o Usuário o qual que dar NDCash", message))

            if(!args[1])
              return message.reply(await client.translate("Diga quanto você quer dar", message));

            if(!Number.isInteger(parseInt(args[1])))
              return message.reply(await client.translate("Você não pode dar números não inteiros", message));

            if(parseInt(args[1]) > cash.ndcash)
              return message.reply(await client.translate("Você não tem dinheiro suficiente para dar", message));

            if(parseInt(args[1]) < 1)
              return message.reply(await client.translate("Você não pode dar menos que N¥1", message));

            if(!mcash) {
            return message.reply(await client.translate("Esse usuário não possui uma conta NDCash portanto você não pode dar dinheiro para este usuário", message));
            } else {
                mcash.ndcash += Payment;
                cash.ndcash -= Payment;
                mcash.save().catch((err) => console.log(err));
                cash.save().catch((err) => console.log(err));
            } return message.channel.send(`${message.author} ` + await client.translate(` deu N¥ ${args[1]} para `, message) + ` ${Mention}`)
        }); 
    }
    });
  }
};
