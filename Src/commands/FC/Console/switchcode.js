const BaseCommand = require("../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const AB = require("../../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Code = require("../../../database/schemas/SwitchCodes");

module.exports = class SwitchCodeCommand extends BaseCommand {
  constructor() {
    super(
      'switchcode', //name
      'Console FriendCode', //category
      [''], //aliases
      '', //usage
      'Registra ou mostra seu Friend Code do Switch' //description
    );
  }

  async run(client, message, args) {

    if(!args[0]) { 
      const Mention = message.author;
    } else {
      const Mention = message.mentions.users.first() || client.users.cache.get(args[0]);
    }

    Code.findOne({ userId: Mention,},
      async (err, code) => {
        if(!code) {
          if(err) console.error("SwitchCode Error: " + err);
          if(!args[0]) { message.reply("Você não digitou seu FriendCode!") }
          if(args[0]) {
            const newCode = new Code({
              username: message.author.tag,
              userId: message.author.id,
              SwitchCode: args.slice(0).join(" "),
            });
            newCode.save().catch((err) => console.error("newSwitchCode Error: " + err));
            message.reply("FriendCode Registrado com Sucesso!")
          }
        } else {
          if(err) console.error("Code Error: " + err)
          if(!args[0]) {
            const embed = new Discord.MessageEmbed()
              .setAuthor(`${Mention.tag}`, `${Mention.displayAvatarURL()}`)
              .setTitle("Switch FriendCode")
              .setDescription(code.SwitchCode)
              .setTimestamp()
              .setFooter(client.user.tag, client.user.displayAvatarURL());
            message.channel.send(embed);
          }
          if(args[0]) {
            const updateCode = args.slice(0).join(" ");
            code.SwitchCode = updateCode;
            code.save().catch((err) => console.error("updateSwitchCode Error: " + err));
            message.reply("Seu FriendCode foi Atualizado com Sucesso!");
          }
        }
      }
    )
  }
}