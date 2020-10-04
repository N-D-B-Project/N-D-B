const BaseCommand = require("../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../../Config/Abbreviations.js");

module.exports = class AliadosCommand extends BaseCommand {
  constructor() {
    super(
      'aliados', //name
      'OwnerInfo', //category
      ['otherbots'], //aliases
      '', //usage
      'Mostra os Bots dos amigos do meu Dev' //description
    );
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


    const HomePage = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setColor("RANDOM")
      .setDescription("Esses são os Bots dos amigos do meu Criador!")
      .addField("N-O-Z", `Reaja com ${NOZEmoji} para ver o link de convite do N-O-Z`) 
      .addField("Kaori Miyazono", `Reaja com ${KAORIEmoji} para ver o link de convite da Kaori Miyazono`)
      .setTimestamp()
      message.delete().catch((O_o) => {});
      message.channel.send(HomePage).then(message => {
        message.react(NOZEmoji).then(r => {})
        message.react(KAORIEmoji).then(r => {})

        const NOZFilter = (reaction, user) =>
        [`${NOZEmoji}`].includes(reaction.emoji.name) &&
        message.author.id === user.id;

        const NOZCollector = message.createReactionCollector(NOZFilter);

        NOZCollector.on("collect", reaction => {
          
        })

        const KAORIFilter = (reaction, user) =>
        [`${KAORIEmoji}`].includes(reaction.emoji.name) &&
        message.author.id === user.id;

        const KAORICollector = message.createReactionCollector(KAORIFilter);

        KAORICollector.on("collect", reaction => {
          
        })
      })
  }
};
