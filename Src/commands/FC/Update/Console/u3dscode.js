const BaseCommand = require("../../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../../../Config/Abbreviations");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Code = require("../../../../database/schemas/ThreeDSCodes");

module.exports = class UpdateThreeDSCodeCommand extends BaseCommand {
  constructor() {
    super(
      '3dscode', //name
      'Console FriendCode', //category
      [''], //aliases
      '', //usage
      'Atualiza seu Friend Code do 3DS' //description
    );
  }

  async run(client, message, args) {
    Code.findOne({ userId: message.author.id,},
      async (err, code) => {
        if(!code) {
          if(err) console.error("Update3DSCode Error: " + err);
          if(!args[0]) { message.reply(`Você não tem seu FriendCode Registrado! n\ Utilize o comando 3dscode para Registra-lo!`) }
        } else {
          if(err) console.error("Code Error: " + err)
          if(!args[0]) {
            message.reply("Digite seu novo FriendCode para Atualizar-lo!");
          }
          if(args[0]) {
            const updateCode = args.slice(0).join(" ");
            code.ThreeDSCode = updateCode;
            code.save().catch((err) => console.error("update3DSCode Error: " + err));
            message.reply("Seu FriendCode foi Atualizado com Sucesso!");
          }
        }
      }
    )
  }
}