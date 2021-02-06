// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate');
  }

  async run(client, guild) {
    let ChannelSend;

    guild.channels.cache.forEach((channel) => {
        if(channel.type === "text" && 
            !ChannelSend && 
            channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        ) ChannelSend = channel;
    });

    if(!ChannelSend) return;

    ChannelSend.send(
        new Discord.MessageEmbed()
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
            .setTitle("N-D-B Joins the Server!")
            .setColor("#00c26f")
            .setDescription([
                `Obrigado por me Adicionar ao seu servidor!`
            ])
            .addFields(
                { name: "Prefix", value: "Meu Prefixo padrão é \`&\`!" },
                { name: "Help", value: "Utilize o comando \`&help\` ou \`&helpp\` para ver meus comandos!" }
            )
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setTimestamp()
    )
  }
}