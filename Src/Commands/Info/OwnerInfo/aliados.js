const BaseCommand = require("../../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class AliadosCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'aliados',
      category: 'OwnerInfo',
      aliases: ['otherbots'],
      usage: '',
      description: 'Mostra os Bots dos amigos do meu Dev' 
    });
  }

  async run(client, message, args) {
    const link1 = (`https://discord.com/oauth2/authorize?client_id=474015315206995978&permissions=8&scope=bot`);
    const link2 =(`https://discord.com/api/oauth2/authorize?client_id=730092279326441574&permissions=8&scope=bot`);

    const NOZ = link1;
    const KAORI = link2;

    const NOZEmoji = client.emojis.cache.get("748965070104690718")
    //("<:NOZ:748965070104690718>");
    const KAORIEmoji = client.emojis.cache.get("748965055177162772")
    //("<:KaoriMiyazono:748965055177162772>");

    message.channel.send(
      new Discord.MessageEmbed()
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setColor("#00c26f")
        .setDescription(await client.translate("Esses são os Bots dos amigos do meu Criador!", message))
        .addFields(
          { name : `N-O-Z ${NOZEmoji}`, value: await client.translate(`Esse é o N-O-Z Bot focado em Administração Criado por Wesley#7777 Para adciona-lo ao seu servidor [Clique aqui]`, message) + `(${NOZ})` },
          { name : `Kaori Miyazono ${KAORIEmoji}`, value: await client.translate(`Essa é a Kaori Miyazono Bot focada em Animes Criado por Ness.js#2021 Para adciona-lo ao seu servidor [Clique aqui]`, message) + `(${KAORI})` }
        )
        .setTimestamp()
    )






    // const Timer = 60000

    // const HomePage = new Discord.MessageEmbed()
    //   .setAuthor(client.user.tag, client.user.displayAvatarURL())
    //   .setColor("#00c26f")
    //   .setDescription("Esses são os Bots dos amigos do meu Criador!")
    //   .addField("N-O-Z", `Reaja com ${NOZEmoji} para ver o link de convite do N-O-Z`) 
    //   .addField("Kaori Miyazono", `Reaja com ${KAORIEmoji} para ver o link de convite da Kaori Miyazono`)
    //   .setTimestamp()
    //   message.delete().catch((O_o) => {});
    //   message.channel.send(HomePage).then((RMsg) => {
    //     RMsg.react(NOZEmoji).then(r => {
    //       const NOZFilter = (reaction, user) =>
    //         [`${NOZEmoji}`].includes(reaction.emoji.name) &&
    //         message.author.id === user.id;

    //         const NOZCollector = message.createReactionCollector(NOZFilter, {time: Timer});

    //         NOZCollector.on("collect", reaction => {
    //             RMsg.edit(
    //               new Discord.MessageEmbed()
    //                 .setAuthor(client.user.tag, client.user.displayAvatarURL())
    //                 .setColor("#00c26f")
    //                 .setDescription([
    //                   `Esse é o N-O-Z Bot criado por Wesley#7777`,
    //                   `Bot focado em adminitração`
    //                   `Para adiciona-lo no seu servidor clique no link abaixo!`
    //                 ])
    //                 .addFields(
    //                   { name: "Link", value: ("Clique aqui")[`${NOZ}`] }
    //                 )
    //                 .setThumbnail()
    //                 .setFooter("Comando Aliados")
    //                 .setTimestamp()
    //             )
    //         })
    //     })

    //     RMsg.react(KAORIEmoji).then(r => {
    //       const KAORIFilter = (reaction, user) =>
    //       [`${KAORIEmoji}`].includes(reaction.emoji.name) &&
    //       message.author.id === user.id;

    //       const KAORICollector = message.createReactionCollector(KAORIFilter, {time: Timer});

    //       KAORICollector.on("collect", reaction => {
    //         RMsg.edit(
    //           new Discord.MessageEmbed()
    //             .setAuthor(client.user.tag, client.user.displayAvatarURL())
    //             .setColor("#00c26f")
    //             .setDescription([
    //               `Essa é a Kaori Miyazono Bot criado por Ness.js#2021`,
    //               `Bot focado em Animes`,
    //               `Para adiciona-lo no seu servidor clique no link abaixo!`
    //             ])
    //             .addFields(
    //               { name: "Link", value: ("Clique aqui")[`${KAORI}`] }
    //             )
    //             .setThumbnail()
    //             .setFooter("Comando Aliados")
    //             .setTimestamp()
    //         )
    //       })
    //     })
    //   })
  }
};
