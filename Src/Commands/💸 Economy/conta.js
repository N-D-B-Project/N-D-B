const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const jimp = require("jimp");
//const {} = require("../../../Config/Abbreviations.js");
const Cash = require("../../Database/Schema/NDCash");

module.exports = class ContaCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "conta",
      category: "💸 Economy",
      aliases: ["bal", "account"],
      usage: "",
      description: "Mostra quanto NDCash (dinheiro) você tem"
    });
  }
  async run(client, message, args) {
    const Mention = message.mentions.members.first() || client.users.cache.get(args[0]);

    const avatar = await jimp.read(message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }));
    const mask = await jimp.read("./Src/Img/Economy/mask.png");
    const infos = await jimp.read("./Src/Img/Economy/infos.png");
    const total = await jimp.read("./Src/Img/Economy/total.png");

    const Default = await jimp.read("./Src/Img/Economy/default.gif");
    //const Deluxe = await jimp.read("./Src/Img/Economy/deluxe.png/gif");
    //const Creator = await jimp.read("./Src/Img/Economy/creator.png/gif");

    const Font = await jimp.loadFont("./Src/Fonts/fnt/Sephora.fnt");

    const Deluxe = await jimp.read("./Src/Img/Economy/default.gif");
    const Creator = await jimp.read("./Src/Img/Economy/default.gif");

    Cash.findOne({ userId: message.author.id }, async (err, cash) => {
      if (!cash) {
        if (err) console.error("Economy Error: " + err);
        message.reply(
          "Você Não possui uma conta NDCash! Para criar-lá utilize o comando criar!");
      } else {
        if (cash.skin === "Default") {
          var background = await jimp.read("./Src/Img/Economy/default.gif");
        } else if (cash.skin === "Deluxe") {
          var background = await jimp.read("./Src/Img/Economy/default.gif");
        } else if (cash.skin === "Creator") {
          var background = await jimp.read("./Src/Img/Economy/default.gif");
        }
        // message.reply("Seu Dinheiro: N¥" + cash.ndcash + "\nPor enquanto vai ficar assim pois as imagens de conta estão sendo feitas!");

        mask.resize(256, 256);
        avatar.resize(256, 256);
        infos.resize(1024, 1024);
        avatar.mask(mask);
        
        background.resize(1024, 512);
        //background.composite(infos, 400, 90);
        background.composite(avatar, 90, 90);
        background.print(Font, 400, 180, message.author.tag);
        background.print(Font, 400, 260, "N¥" + cash.ndcash)
        .write('conta.png');
        //const ContaIMG = {files: ['conta.png']}

        const ContaEmbed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setTitle("Sistema de Economia")
          .attachFiles(['conta.png'])
	        .setImage('attachment://conta.png')
          .setColor("#00c26f")
          .setFooter("NDCash | " + client.user.tag, client.user.displayAvatarURL())
          .setTimestamp();
        message.channel.send(ContaEmbed)
        //message.channel.send(``, {files: ['conta.png']});
      }
    });
  }
};


/*Cash.findOne({ userId: Mention.id }, async (err, mcash) => {
          if (mcash.skin === "Default") {
            var background = await jimp.read("./Src/Img/Economy/default.gif");
          } else if (mcash.skin === "Deluxe") {
            var background = await jimp.read("./Src/Img/Economy/default.gif");
          } else if (mcash.skin === "Creator") {
            var background = await jimp.read("./Src/Img/Economy/default.gif");
          }
          // message.reply("Seu Dinheiro: N¥" + cash.ndcash + "\nPor enquanto vai ficar assim pois as imagens de conta estão sendo feitas!");
  
          mask.resize(256, 256);
          avatar.resize(256, 256);
          infos.resize(1024, 1024);
          avatar.mask(mask);
          
          background.resize(1024, 512);
          //background.composite(infos, 400, 90);
          background.composite(avatar, 90, 90);
          background.print(Font, 400, 180, message.mention.tag);
          background.print(Font, 400, 260, "N¥" + mcash.ndcash)
          .write('conta.png');
          //const ContaIMG = {files: ['conta.png']}
  
          const MContaEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle("Economy System")
            .attachFiles(['conta.png'])
            .setImage('attachment://conta.png')
            .setColor("#00c26f")
            .setFooter("NDCash | " + client.user.tag, client.user.displayAvatarURL())
            .setTimestamp();
          message.channel.send(MContaEmbed)
          //message.channel.send(``, {files: ['conta.png']});
        });*/