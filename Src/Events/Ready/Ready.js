const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");
const cron = require("node-cron");

module.exports = class ReadyEvent extends BaseEvent {
    constructor(...args) {
        super(...args, {
            name: "ready",
            once: true,
        });
    }

    async run(client) {
        //* Logs
        client.logger.ready(`${client.user.tag} Está Online!`)
        client.logger.command(`${client.commands.size} Commands`)
        client.logger.event(`${client.events.size} Events`)

        //! Client Rich Presence
        function setStatus() {
            const AStatus = client.Tools.Status[Math.floor(Math.random() * client.Tools.Status.length)];
            client.user.setPresence({ activity: AStatus });
        }
        setStatus();
        setInterval(() => setStatus(), 120000);

        //@ Oleo De Macaco 🐵
        const attachment = new Discord.MessageAttachment("./Src/Img/Videos/mamaco.mp4");
        const JobsChannel = client.channels.cache.get("708786184096055347");
        const NedChannel = client.channels.cache.get("796380307547881482");
        // const TestChannel = client.channels.cache.get("717094267767488554");
        const Oleo = '0 0 * * *'
        const Mamaco = cron.schedule(Oleo, () => {
            JobsChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!", attachment)
            NedChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!", attachment)
            // TestChannel.send("Meia Noite o Horario Oficial do Oleo de Mamaco 🐒 vlw!", attachment)
          },{
            scheduled: true,
            timezone: "America/Sao_Paulo"
          })
    }
}