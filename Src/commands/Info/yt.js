const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class yt extends BaseCommand {
  constructor() {
    super("yt", "info", []);
  }

  async run(client, message, args) {
    const ytlogo = "<:youtube:730741995416453150>";
    const embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setColor("##00c26f")
      .setDescription("Este é o canal do YouTube do meu Criador!")
      .setTitle(`${ytlogo} clique aqui`)
      .setURL("https://www.youtube.com/channel/UCbljj-LSlXuiB1EprNDl8MA")
      .setTimestamp();
    message.channel.send(embed);
  }
};
