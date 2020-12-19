const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class TempBanCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'tempban', //name
      category: 'ModTools', //category
      aliases: ['tempbanir'], //aliases
      usage: 'ban <mencione um usuário> <tempo do banimento> <motivo>', //usage
      description: 'Bane o usuário mencionado do servidor' //description
    });
  }

  async run(client, message, args) {
    const banEmoji = "<:MJb_banido:711695336363655198>";

    if (!message.member.hasPermission("BAN_MEMBERS")) {
      message.channel.send("Você não tem permissão para utilizar este comando");
    } else {
      try {
        const Mention = message.mentions.members.first() 
          || message.guild.members.cache.get(args[0]) 
          || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(" ") 
          || x.user.username === args[0]);
        const Reason = args.slice(2).join(" ") || "Motivo não especificado";
        // const target = message.guild.members.cache.get(Mention.id);
        const target = message.guild.member(message.mentions.users.first());
        const Days = args[1];
        if(!Days) return message.reply("Por favor diga por quanto tempo quer banir o usuário");
        if(isNaN(Days)) return message.reply(`${args[1]} Não é um numero`);
        if(!isNaN(Days)) Days = parseInt(args[1]);
            
        if(!Mention) {
          message.channel.send("Mencione quem você quer banir temporariamente");
        } else {
          target.ban({
            days: Days,
            reason: Reason
          });
            //.then(console.log("B A N I D O"))
            //.catch(console.error);
          message.channel.send(`${Mention} Foi ${banEmoji}\nPor ${Days}Dias\nMotivo: ${Reason}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
