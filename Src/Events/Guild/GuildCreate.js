const BaseEvent = require("../../Utils/Structures/BaseEvent");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const GuildConfigRoles = require("../../Database/Schema/GuildRoles");
const GuildConfigChannels = require("../../Database/Schema/GuildRoles");

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: "guildCreate",
    });
  }

  async run(client, guild) {
    //! GuildConfigs
    try {
      const guildConfig = await GuildConfig.create({
        guildId: guild.id,
        guildName: guild.name,
      });
      const guildConfigRoles = await GuildConfigRoles.create({
        guildId: guild.id,
        guildName: guild.name,
      });
      const guildConfigChannels = await GuildConfigChannels.create({
        guildId: guild.id,
        guildName: guild.name,
      });
      client.logger.dtb(
        "N-D-B Entrou no Server:" + guild.name + ". Salvo na DataBase!"
      );
    } catch (err) {
      client.logger.error(err);
    }

    //@ JoinMessage
    let ChannelSend;

    guild.channels.cache.forEach((channel) => {
      if (
        channel.type === "text" &&
        !ChannelSend &&
        channel.permissionsFor(guild.me).has("SEND_MESSAGES")
      )
        ChannelSend = channel;
    });

    if (!ChannelSend) return;

    ChannelSend.send(
      new Discord.MessageEmbed()
        .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setTitle("N-D-B Joins the Server!")
        .setColor("#00c26f")
        .setDescription([`Obrigado por me Adicionar ao seu servidor!`])
        .addFields(
          { name: "Prefix", value: "Meu Prefixo padrão é `&`!" },
          { name: "Help", value: "Utilize o comando `&help` para ver meus comandos!", },
          { name: "Configurar", value: "Para me configurar utilize o comando &setup", }
        )
        .setFooter(client.user.tag, client.user.displayAvatarURL())
        .setTimestamp()
    );
  }
};
