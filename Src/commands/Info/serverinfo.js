const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const {
  filterLevels,
  verificationLevels,
  regions 
} = require("../../Tools/ServersDetails");
const moment = require("moment");
const trimArray = require("../../Tools/trimArray");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ServerInfoCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'serverinfo', //name
      category: 'Info', //category
      aliases: [''], //aliases
      usage: '', //usage
      description: 'Mostra as informações do Servidor' //description
    });
  }

  async run(client, message, args) {
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
        .setTitle(guildName, "Server Info")
        .setColor("RANDOM")
        .setDescription("Essas são as informações sobre o servidor!")
        .setThumbnail(guildIcon)
        .addField('Guild', [
            `**❯ Nome:** ${guildName}`,
            `**❯ Id:** ${guildId}`,
            `**❯ Dono:** ${guildOwnerTag} (${guildOwnerId})`,
            `**❯ Região:** ${regions[guildRegion]}`,
            `**❯ Boost Level:** ${guildBoost ? `Nível${guildBoost}` : `Nenhum`}`,
            `**❯ Filtro Explicito:** ${filterLevels[guildFilter]}`,
            `**❯ Nível de Verificação:** ${verificationLevels[guildVerification]}`,
            `**❯ Criado em:** ${moment(guildCreated).format("LT")} ${moment(guildCreated).format("DD/MM/YYYY")} ${moment(guildCreated).fromNow()}`,
            "\u200b"
        ])
        .addField("Estatísticas", [
            `**❯ Cargos:** ${guildRoles.length}`,
            `**❯ Emojis:** ${guildEmojis.size}`,
            `**❯ Emojis Normais:** ${guildEmojis.filter(guildEmojis => !guildEmojis.animated).size}`,
            `**❯ Emojis Animados:** ${guildEmojis.filter(guildEmojis => guildEmojis.animated).size}`,
            `**❯ Membros:** ${guildNormalMembers}`,
            `**❯ Humanos:** ${guildMembers.filter(member => !member.user.bot).size}`,
            `**❯ Bots:** ${guildMembers.filter(member => member.user.bots).size}`,
            `**❯ Canais de Texto:** ${guildChannels.filter(channel => channel.type === "text").size}`,
            `**❯ Canais de Voz:** ${guildChannels.filter(channel => channel.type === "voice").size}`,
            `**❯ Boosts:** ${guildPremiumMembers || "0"}`,
            "\u200b"
        ])
        .addField("Presença", [
            `**❯ Online:** ${guildMembers.filter(member => member.presence.status === "online").size}`,
            `**❯ Ausente:** ${guildMembers.filter(member => member.presence.status === "idle").size}`,
            `**❯ Não Perturbe:** ${guildMembers.filter(member => member.presence.status === "dnd").size}`,
            `**❯ Offline:** ${guildMembers.filter(member => member.presence.status === "offline").size}`,
            "\u200b"
        ])
        .addField(`Cargos [${guildRoles.length - 1}]`, guildRoles.length < 10 ? guildRoles.join(", ") : guildRoles.length > 10 ? trimArray(guildRoles) : "Nenhum")
        .setTimestamp();
    message.channel.send(embed)
  }
}