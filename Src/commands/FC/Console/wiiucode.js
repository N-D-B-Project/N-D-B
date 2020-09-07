const BaseCommand = require("../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const AB = require("../../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Code = require("../../../database/schemas/WiiUCodes");

module.exports = class WiiUCodeCommand extends BaseCommand {
  constructor() {
    super('wiiucode', 'Console', []);
  }

  async run(client, message, args) {
    Code.findOne({ userId: message.author.id,},
      async (err, code) => {
        if(!code) {
          if(err) console.error("WiiUCode Error: " + err);
          if(!args[0]) { message.reply("Você não digitou seu FriendCode!") }
          if(args[0]) {
            const newCode = new Code({
              username: message.author.tag,
              userId: message.author.id,
              WiiUCode: args.slice(0).join(" "),
            });
            newCode.save().catch((err) => console.error("newWiiUCode Error: " + err));
            message.reply("FriendCode Registrado com Sucesso!")
          }
        } else {
          if(err) console.error("Code Error: " + err)
          if(!args[0]) {
            const embed = new Discord.MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setTitle("WiiU FriendCode")
              .setDescription(code.WiiUCode)
              .setTimestamp()
              .setFooter(client.user.tag, client.user.displayAvatarURL());
            message.channel.send(embed);
          }
          if(args[0]) {
            const updateCode = args.slice(0).join(" ");
            code.WiiUCode = updateCode;
            code.save().catch((err) => console.error("updateWiiUCode Error: " + err));
            message.reply("Seu FriendCode foi Atualizado com Sucesso!");
          }
        }
      }
    )
  }
}