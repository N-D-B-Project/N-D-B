const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const moment = require("moment");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ServerInfoCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'serverinfo',
      category: 'Info',
      aliases: [''],
      usage: '',
      description: 'Mostra as informações do Servidor'
    });
  }

  async run(client, message, args) {

    const {
      filterLevels,
      verificationLevels,
      regions 
    } = client.Tools.ServerDetails

    const guildName = message.guild.name;
    const guildId = message.guild.id;
    const guildIcon = message.guild.iconURL();
    const guildOwnerTag = message.guild.owner.user.tag;
    const guildOwnerId = message.guild.owner.id;
    const guildRegion = message.guild.region;
    const guildBoost = message.guild.premiumTier;
    const guildFilter = message.guild.explicitContentFilter;
    const guildVerification = message.guild.verificationLevel;
    const guildCreated = message.guild.createdTimestamp;
    const guildRoles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
    const guildEmojis = message.guild.emojis.cache;
    const guildMembers = message.guild.members.cache;
    const guildNormalMembers = message.guild.memberCount;
    //const guildBotMembers = message.guild.member.user.bot;
    const guildPremiumMembers = message.guild.premiumSubscriptionCount;
    //const guildMemberPresence = message.guild.member.presence.status;
    const guildChannels = message.guild.channels.cache;

    const embed = new Discord.MessageEmbed()
        .setTitle(guildName, await client.translate("Server Info", message))
        .setColor("#00c26f")
        .setDescription("Essas são as informações sobre o servidor!")
        .setThumbnail(guildIcon)
        .addField('Guild', [
          await client.translate(`**❯ Nome:**`, message) + ` ${guildName}`,
          await client.translate(`**❯ Id:**`, message) + ` ${guildId}`,
          await client.translate(`**❯ Dono:**`, message) + ` ${guildOwnerTag} (${guildOwnerId})`,
          await client.translate(`**❯ Região:**`, message) + ` ${regions[guildRegion]}`,
          await client.translate(`**❯ Nível do Boost:**`, message) + ` ${guildBoost}` ? await client.translate(`Nível`, message) + `${guildBoost}` : await client.translate(`Nenhum`, message),
          await client.translate(`**❯ Filtro Explicito:**`, message) + ` ${filterLevels[guildFilter]}`,
          await client.translate(`**❯ Nível de Verificação:**`, message) + ` ${verificationLevels[guildVerification]}`,
          await client.translate(`**❯ Criado em:**`, message) + ` ${moment(guildCreated).format("LT")} ${moment(guildCreated).format("DD/MM/YYYY")} ${moment(guildCreated).fromNow()}`,
            "\u200b"
        ])
        .addField(await client.translate("Estatísticas", message), [
          await client.translate(`**❯ Cargos:**`, message) + ` ${guildRoles.length}`,
          await client.translate(`**❯ Emojis:** `, message) + ` ${guildEmojis.size}`,
          await client.translate(`**❯ Emojis Normais:**`, message) + ` ${guildEmojis.filter(guildEmojis => !guildEmojis.animated).size}`,
          await client.translate(`**❯ Emojis Animados:**`, message) + ` ${guildEmojis.filter(guildEmojis => guildEmojis.animated).size}`,
          await client.translate(`**❯ Membros:**`, message) + ` ${guildNormalMembers}`,
          await client.translate(`**❯ Humanos:**`, message) + ` ${guildMembers.filter(member => !member.user.bot).size}`,
          await client.translate(`**❯ Bots:**`, message) + ` ${guildMembers.filter(member => member.user.bots).size}`,
          await client.translate(`**❯ Canais de Texto:**`, message) + ` ${guildChannels.filter(channel => channel.type === "text").size}`,
          await client.translate(`**❯ Canais de Voz:**`, message) + ` ${guildChannels.filter(channel => channel.type === "voice").size}`,
          await client.translate(`**❯ Impulsos:**`, message) + ` ${guildPremiumMembers || "0"}`,
            "\u200b"
        ])
        .addField(await client.translate("Presença", message), [
          await client.translate(`**❯ Online:**`, message) + ` ${guildMembers.filter(member => member.presence.status === "online").size}`,
          await client.translate(`**❯ Ausente:**`, message) + ` ${guildMembers.filter(member => member.presence.status === "idle").size}`,
          await client.translate(`**❯ Não Perturbe:**`, message) + ` ${guildMembers.filter(member => member.presence.status === "dnd").size}`,
          await client.translate(`**❯ Offline:**`, message) + ` ${guildMembers.filter(member => member.presence.status === "offline").size}`,
            "\u200b"
        ])
        .addField(await client.translate(`Cargos`, message) `[${guildRoles.length - 1}]`, guildRoles.length < 10 ? guildRoles.join(", ") : guildRoles.length > 10 ? client.Tools.trimArray(guildRoles) : await client.translate("Nenhum", message))
        .setTimestamp();
    message.channel.send(embed)
  }
}