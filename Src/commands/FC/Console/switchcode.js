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
    super('switchcode', 'Console', []);
  }

  async run(client, message, args) {
    Code.findOne({ userId: message.author.id,},
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
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
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