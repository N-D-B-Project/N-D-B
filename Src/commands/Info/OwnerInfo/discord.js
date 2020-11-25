const BaseCommand = require("../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class DevDiscordCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'discord', //name
      category: 'OwnerInfo', //category
      aliases: ['devdiscord', 'botdiscord'], //aliases
      usage: '', //usage
      description: 'Manda o link de convite do Discord do meu Dev' //description
    });
  }

  async run(client, message, args) {
    const discordlogo = "<:discord:739591596248530985>";
    const embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setColor("#00c26f")
      .setDescription("Este é o servidor do Discord do meu Criador!")
      .setTitle(`${discordlogo} clique aqui`)
      .setURL("https://discord.gg/mMapzad")
      .setTimestamp();
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
