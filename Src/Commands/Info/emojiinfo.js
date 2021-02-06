const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'emojiinfo',
      category: 'Info',
      aliases: ['einfo'],
      usage: 'einfo <emoji>',
      description: 'Mostra as informações do Emoji',
    });
  }

  async run(client, message, args, [emote]) {
    const regex = emote.replace(/^<a:\w+:(\d+)>$/, '$1');

    const emoji = message.guild.emojis.cache.find((emj) => emj.name === emote || emj.id === regex);
    if(!emoji) return message.channel.send('Por favor diga um emoji valido');

    const authorFetch = await emoji.fetchAuthor();
    const checkOrCross = (bool) => bool ? '✅' : '❎';

    const embed = new Discord.MessageEmbed()
        .setDescription(`**Informações do Emoji: __${emoji.name.toLowerCase}__**`)
        .setColor("#00c26f")
        .setThumbnail(emoji.url)
        .addField('Geral:', [
            `**❯ ID:** ${emoji.id}`,
            `**❯ URL:** [Link do Emoji](${emoji.url})`,
            `**❯ Adicionado por:** ${authorFetch.tag} (${authorFetch.id})`,
            `**❯ Criado em:** ${moment(emoji.createdTimestamp).format("LT")} ${moment(emoji.createdTimestamp).format("DD/MM/YYYY")} ${moment(emoji.createdTimestamp).fromNow()}`,
            `**❯ Acessivel para:** ${emoji.roles.cache.map((role) => role.name).join(', ' || 'Everyone')}`
        ])
        .addField('Outros:'[
            `**❯ Requer Nitro:** ${checkOrCross(emoji.requiresColons)}`,
            `**❯ :** ${checkOrCross(emoji.deletable)}`,
            `**❯ :** ${checkOrCross(emoji.animated)}`,
            `**❯ :** ${checkOrCross(emoji.managed)}`
        ]);
    return message.guild.send(embed);
  }
}