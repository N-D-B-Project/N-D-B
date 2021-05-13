const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class PingCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'ping',
      category: 'ℹ Info',
      aliases: ['pong'],
      usage: '',
      description: 'Mostra a latência do Bot com a API do Discord'
    });
  }

  async run(client, message, args) {
    let embed1 = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle("Ping?")
      .setColor("RANDOM")
      .setFooter("ping", client.user.displayAvatarURL);
    message.delete().catch((O_o) => {});
    const ms = await message.channel.send(embed1);

    let embed2 = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle("Pong?")
      .setColor("RANDOM")
      .setDescription(
        `📡A latencia é ${Math.floor(
          message.createdTimestamp - message.createdTimestamp
        )}ms.\n🖥"A latencia da API é ${client.ws.ping}ms.`
      )
      .setFooter("ping", client.user.displayAvatarURL());
    ms.edit(embed2);
  }
};
