const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = class UptimeCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'uptime',
      category: 'ℹ Info',
      aliases: [''],
      usage: '',
      description: 'Mostra quanto tempo o Bot está Online'
    });
  }

  async run(client, message, args) {
    // let totalSeconds = client.uptime / 1000;
    // let days = Math.floor(totalSeconds / 86400);
    // let hours = Math.floor(totalSeconds / 3600);
    // totalSeconds %= 3600;
    // let minutes = Math.floor(totalSeconds / 60);
    // let seconds = totalSeconds % 60;
    // const T1 = "Dias";
    // const T2 = "Horas";
    // const T3 = "Minutos";
    // const T4 = "Segundos";

    // let uptime = `\n> 📅 ${days} ${T1} \n> ⌚ ${hours} ${T2} \n> 🕐 ${minutes} ${T3} \n> ⏳ ${seconds} ${T4}`;
    // const uptime = `\n> 📅 ${time.days} ${T1} \n> ⌚ ${time.hours} ${T2} \n> 🕐 ${time.minutes} ${T3} \n> ⏳ ${time.seconds} ${T4}`;

    //const time = ms(client.uptime)

    const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    
    const embed = new Discord.MessageEmbed()
      .setTitle("N-D-B Bot Uptime")
      .setColor("#00c26f")
      .setDescription(`${uptime}`);
    //message.delete().catch((O_o) => {});
    message.channel.send(embed);
  }
};
