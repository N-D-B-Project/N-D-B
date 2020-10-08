const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class AvatarCommand extends BaseCommand {
  constructor() {
    super(
      'avatar', //name
      'Info', //category
      [''], //aliases
      'avatar <mencione um usuário>', //usage
      'Exibe seu avatar ou do usuário mencionado' //description
    );
  }

  async run(client, message, args) {
    let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else if (args[0]) {
      user = message.guild.members.cache.get(args[0]).user;
    } else {
      user = message.author;
    }

    let avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
    let Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setImage(avatar)
      .setTitle("Baixar")
      .setURL(avatar)
      .setTimestamp()
      .setFooter(client.user.tag, client.user.displayAvatarURL());
    message.delete().catch((O_o) => {});
    message.channel.send(Embed);
  }
};
