const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class KissCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'kiss', //name
      category: 'Anime', //category
      aliases: ['beijar'], //aliases
      usage: 'kiss <mencione um usuário>', //usage
      description: 'Ao mencionar um usuário aparece um Gif dizendo que você beijou' //description
    });
  }

  async run(client, message, args) {
    const kisses = client.Tools.kisses;
    let sender = message.author;
    let senderTag = message.author.tag;
    let senderId = message.author.id;
    let senderPic = message.author.displayAvatarURL({
      size: 4096,
      dynamic: true,
    });
    //quem info
    let quemTag;
    let quem = message.content.slice(args[0]).split(" ");
    quem = quem[1];
    try {
      quemTag = message.mentions.users.first().tag;
    } catch (e) {
      await message.delete().catch((O_o) => {});
      message.channel.send(
        `${sender}, Mencione um Usuário!`
      );
      return;
    }
    let quemId = message.mentions.users.first().id;
    let quemPic = message.mentions.users.first();
    quemPic = quemPic.displayAvatarURL({ size: 4096, dynamic: true });

    let switcher;

    if (message.author.id === quemId) {
      await message.delete().catch((O_o) => {});
      message.channel.send(`${sender}, Espera, isso é possível!?`);
      return;
    }

    let kiss = kisses[Math.floor(Math.random() * kisses.length)];

    const Embed = new Discord.MessageEmbed()
      .setColor(`RANDOM`)
      .setAuthor(senderTag, senderPic)
      .setTitle(" 😻 Beijou: ")
      .setDescription(quem)
      .setImage(kiss)
      .setFooter("💞 Clique pra retornar!");
    await message.delete().catch((O_o) => {});
    let messageEmbed = await message.channel.send(Embed);
    messageEmbed.react("💞");

    const filter = (reaction, user) => {
      return ["💞"].includes(reaction.emoji.name) && user.id === quemId;
    };

    messageEmbed
      .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "💞") {
          messageEmbed.reactions
            .removeAll()
            .catch((error) =>
              console.error("Failed to clear reactions: ", error)
            );
          if (quemTag === "Kaori Miyazono#5192") {
            return;
          }
          //console.log("RETORNAR");
          Retornar();
        } else {
        }
      })
      .catch((collected) => {
        console.log("Error!");
      });

    async function Retornar() {
      switcher = sender;
      sender = quem;
      quem = switcher;

      switcher = senderTag;
      senderTag = quemTag;
      quemTag = switcher;

      switcher = senderId;
      senderId = quemId;
      quemId = switcher;

      switcher = senderPic;
      senderPic = quemPic;
      quemPic = switcher;

      let kiss = kisses[Math.floor(Math.random() * kisses.length)];

      const Embed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setAuthor(senderTag, senderPic)
        .setTitle(" 😻 Beijou: ")
        .setDescription(quem)
        .setImage(kiss)
        .setFooter("💞 Clique pra retornar!");
      messageEmbed = await message.channel.send(Embed);
      messageEmbed.react("💞");
      const filter = (reaction, user) => {
        return ["💞"].includes(reaction.emoji.name) && user.id === quemId;
      };

      messageEmbed
        .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
        .then((collected) => {
          const reaction = collected.first();

          if (reaction.emoji.name === "💞") {
            messageEmbed.reactions
              .removeAll()
              .catch((error) =>
                console.error("Failed to clear reactions: ", error)
              );
            //console.log("RETORNAR 2 !");
            Retornar();
          } else {
          }
        })
        .catch((collected) => {});
    }
  }
};
