const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");
const cron = require('node-cron');

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  
  async run(client, message, guild) {
    //const link = "https://cdn.discordapp.com/attachments/708786184096055347/837830103035150416/macaco_oleo_edpererira.mp4"
    const attachment = new Discord.MessageAttachment("./Src/Img/Videos/mamaco.mp4");
    // const embed = new Discord.MessageEmbed()
    //   //.setAuthor(guild.name, guild.iconURL())
    //   .setColor("#00c26f")
    //   .setTitle("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!")
    //   .setFooter(client.user.username, client.user.displayAvatarURL())
    //   .setImage("attachment://mamaco.mp4")
    //   .setTimestamp()
    
    //const Test = '54 21 * * *'
    //const second = '* * * * * *'
    const Oleo = '0 0 * * *'
    const TestChannel = client.channels.cache.get("717094267767488554");
    const NedChannel = client.channels.cache.get("796380307547881482");
    const JobsChannel = client.channels.cache.get("708786184096055347");
    const Mamaco = cron.schedule(Oleo, () => {
      //JobsChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!")
      //JobsChannel.send(link)
      TestChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!")
      TestChannel.send(attachment)
      // NedChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!")
      // NedChannel.send(link)
    },{
      scheduled: true,
      timezone: "America/Sao_Paulo"
    })

    
  }
};
