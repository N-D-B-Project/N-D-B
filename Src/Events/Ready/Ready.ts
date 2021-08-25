import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";
import cron from "node-cron"

module.exports = class ReadyEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "ready";
    const options = {
      name: "ready",
      type: "once",
    };

    super(client, name, options);
  }

  async run(client: NDBClient) {
    //% SlashHandler || For some reason this doesn't work if it's not inside ReadyEvent
    client.SlashHandler.loadSlashCommands();

    //% Create GuildConfigs on Client Start
    // const guild = client.guilds.cache.map((i) => i.id);
    // client.MongoDB.CreateOnStart(guild)

    //* Logs
    client.logger.ready(`${client.user.tag} Está Online!`);
    client.logger.event(`${client.events.size} Events`);
    client.logger.command(`${client.commands.size} Commands`);

    //! Client Rich Presence
    function setStatus() {
      const AStatus = client.Tools.Status[Math.floor(Math.random() * client.Tools.Status.length)];
      client.user.setPresence({ activities: [{ name: "ONLINE" }] });
    }
    setStatus();
    setInterval(() => setStatus(), 120000);

    //@ Oleo De Macaco 🐵
    // const JobsChannel = client.channels.cache.get("708786184096055347");
    // const NedChannel = client.channels.cache.get("796380307547881482");
    // // const TestChannel = client.channels.cache.get("717094267767488554");
    // const Oleo = '0 0 * * *'
    // const Mamaco = cron.schedule(Oleo, () => {
    //   let random = Math.floor(Math.random() * 10);
    //   if (random === 5) {
    //     var attachment = new Discord.MessageAttachment("./Src/Img/Videos/MamacoWhatsapp.mp4");
    //   } else {
    //     var attachment = new Discord.MessageAttachment("./Src/Img/Videos/Mamaco.mp4");
    //   }
    //   JobsChannel.send({ content: "Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!", files: [attachment] }) 
    //   // NedChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!", attachment)
    //   // TestChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!", attachment)
    // }, {
    //   scheduled: true,
    //   timezone: "America/Sao_Paulo"
    // })
  }
}
