const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const waifus = require("../../Tools/Waifu");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class WaifuCommand extends BaseCommand {
  constructor() {
    super(
      'waifu', //name
      'Anime', //category
      [''], //aliases
      '', //usage
      'O Bot manda um Gif com uma Waifu e uma porcentagem(%)' //description
    );
  }

  async run(client, message, args) {
    //console.log(`${waifus.length} Gifs de waifu!`);
    let waifu = waifus[Math.floor(Math.random() * waifus.length)];
    let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else if (args[0]) {
      user = message.guild.members.cache.get(args[0]).user;
    } else {
      user = message.author;
    }
    let avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
    let taxa = Math.floor(Math.random() * 101);

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(user.tag, avatar)
      .setDescription(`Taxa de sucesso: ${taxa}%`)
      .setTitle("Sua Waifu é:")
      .setImage(waifu)
      .setTimestamp();
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
