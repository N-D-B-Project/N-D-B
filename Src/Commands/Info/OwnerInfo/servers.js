const BaseCommand = require("../../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ServersCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'servers',
      category: 'OwnerInfo',
      aliases: ['faltaquanto', 'verificação', 'botverification'],
      usage: '',
      description: 'Mostra quantos server faltam para o Bot ser verificado'
    });
  }

  async run(client, message, args) {
    var sv = `${client.guilds.cache.size}`;
    var precisa = 75;
    let resta = precisa - sv;
    const quanto = `Estou em ${client.guilds.cache.size} Servers`;
    const falta = `Preciso estar em mais ${resta} para ser verificado`;
    const embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setTitle(await client.translate("**__Verificação__**", message))
      .addField(await client.translate(quanto, message), "✅")
      .addField(await client.translate(falta, message), "❔")
      .setColor(`#00c26f`)
      .setTimestamp();
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
