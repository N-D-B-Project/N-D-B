const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class UptimeCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'uptime',
      category: 'Info',
      aliases: [''],
      usage: '',
      description: 'Mostra quanto tempo o Bot está Online'
    });
  }

  async run(client, message, args) {
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    const T1 = await client.translate("Dias", message)
    const T2 = await client.translate("Horas", message)
    const T3 = await client.translate("Minutos", message)
    const T4 = await client.translate("Segundos", message)

    let uptime = `\n> 📅 ${days} ${T1} \n> ⌚ ${hours} ${T2} \n> 🕐 ${minutes} ${T3} \n> ⏳ ${seconds} ${T4}`;

    const embed = new Discord.MessageEmbed()
      .setTitle("N-D-B Bot Uptime")
      .setColor("#00c26f")
      .setDescription(`${uptime}`);
    message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
