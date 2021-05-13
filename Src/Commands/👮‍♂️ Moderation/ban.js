const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class BanCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'ban',
      category: '👮‍♂️ Moderation',
      aliases: ['banir'],
      usage: 'ban <mencione um usuário>',
      description: 'Bane o usuário mencionado do servidor'
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
        const Reason = args.slice(1).join(" ") || "Motivo não especificado";
        const target = message.guild.members.cache.get(Mention.id);
        if(!Mention) {
          message.channel.send("Mencione quem você quer banir");
        } else {
          target.ban({
            reason: Reason
          });
            //.then(console.log("B A N I D O"))
            //.catch(console.error);
          message.channel.send(`${Mention} Foi ${banEmoji}\nMotivo: ${Reason}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
