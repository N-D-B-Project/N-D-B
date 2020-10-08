const BaseCommand = require("../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Code = require("../../../database/schemas/ThreeDSCodes");

module.exports = class ThreeDSCodeCommand extends BaseCommand {
  constructor() {
    super(
      '3dscode', //name
      'Console FriendCode', //category
      [''], //aliases
      '', //usage
      'Registra ou mostra seu Friend Code do 3DS' //description
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
          if(err) console.error("3DSCode Error: " + err);
          if(!args[0]) { message.reply("Você não digitou seu FriendCode!") }
          if(args[0]) {
            const newCode = new Code({
              username: message.author.tag,
              userId: message.author.id,
              ThreeDSCode: args.slice(0).join(" "),
            });
            newCode.save().catch((err) => console.error("new3DSCode Error: " + err));
            message.reply("FriendCode Registrado com Sucesso!")
          }
        } else {
          if(err) console.error("Code Error: " + err)
          if(!args[0]) {
            const embed = new Discord.MessageEmbed()
              .setAuthor(`${Mention.tag}`, `${Mention.displayAvatarURL()}`)
              .setTitle("3DS FriendCode")
              .setDescription(code.ThreeDSCode)
              .setTimestamp()
              .setFooter(client.user.tag, client.user.displayAvatarURL());
            message.channel.send(embed);
          }
          if(args[0]) {
            const embed = new Discord.MessageEmbed()
              .setAuthor(`${Mention.tag}`, `${Mention.displayAvatarURL()}`)
              .setTitle("3DS FriendCode")
              .setDescription(code.ThreeDSCode)
              .setTimestamp()
              .setFooter(client.user.tag, client.user.displayAvatarURL());
            message.channel.send(embed);
          }
        }
      }
    )
  }
}