const BaseCommand = require("../../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class DevDiscordCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'discord',
      category: 'OwnerInfo',
      aliases: ['devdiscord', 'botdiscord'],
      usage: '',
      description: 'Manda o link de convite do Discord do meu Dev'
    });
  }

  async run(client, message, args) {
    const discordlogo = "<:discord:739591596248530985>";
    const embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setColor("#00c26f")
      .setDescription(await client.translate("Este é o servidor do Discord do meu Criador!", message))
      .setTitle(`${discordlogo}` + await client.translate(`clique aqui`, message))
      .setURL("https://discord.gg/mMapzad")
      .setTimestamp();
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
