const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const Canvas = require("canvas");
const Color = require("../../../Config/Colours.json");
const AB = require("../../../Config/Abbreviations.js");

/*
const DefaultImg = require("../../Models/Img/Economy/Default.png");
const DeluxeImg = require("../../Models/Img/Economy/Deluxe.png");
const CreatorImg = require("../../Models/Img/Economy/Creator.png");
*/

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Profile = require("../../database/schemas/Profile");

module.exports = class ContaCommand extends BaseCommand {
  constructor() {
    super(
      'conta', //name
      'Economy', //category
      ['bal'], //aliases
      '', //usage
      'Mostra quanto NDCash (dinheiro) você tem' //description
    );
  }

  async run(client, message, args) {
    Profile.findOne({ userId: message.author.id,}, 
      async (err, profile) => {
        if(!profile) {
          if(err) console.error("Economy Error: " + err);
          message.reply("Você Não possui uma conta NDCash! Para criar-lá utilize o comando criar!")
        } else {
          const canvas = Canvas.createCanvas(700, 700); // Tamanho Da imagem X/Y
          const ctx = canvas.getContext("2d");

          const testImg = require("../../Models/Img/Economy/text.png");

          if(profile.skin === "Default") {
            var background = await Canvas.loadImage(
              `${textImg}`
            );
          } else if (profile.skin === "Deluxe") {
            var background = await Canvas.loadImage(
              "https://www.drodd.com/images14/black16.jpg"
            );
          } else if (profile.skin === "Creator") {
            var background = await Canvas.loadImage(
              "https://www.drodd.com/images14/black16.jpg"
            );
          }
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = Color.green_dark;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = Color.green_dark;
          let size1 = 50
          let size2 = 40

          do {
            ctx.font = `${(size1 -= 5)}px sans-serif`;
          } while (ctx.measureText(message.author.tag).width > canvas.width - 225);

          ctx.fillText(message.author.tag, 200, 65);
          let valor = "Seu Dinheiro: N¥" + profile.ndcash;
          do {
            ctx.font = `${(size2 -= 5)}px sans-serif`;
          } while (ctx.measureText(valor).width > canvas.width - 225);
          ctx.fillText(valor, 200, 110);
  
          ctx.beginPath();
  
          ctx.arc(100, 100, 75, 0, Math.PI * 2, true);
  
          ctx.closePath();
  
          ctx.clip();
  
          const avatar = await Canvas.loadImage(
            message.author.displayAvatarURL({ format: "jpg" })
          );
  
          ctx.drawImage(avatar, 25, 25, 150, 150); // Tamanho do Avatar
  
          const final = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "valor.png"
          );
          message.delete().catch((O_o) => {});
          return message.channel.send(final);
        }
      }
    )
  }
}