const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const fetch = require("node-fetch");

module.exports = class DocsCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'docs',
      category: 'Developer Tools',
      aliases: [''],
      usage: '<searchQuery>',
      description: 'Mostra informações da Documentação do Discord.JS',
      botPerms: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
      ownerOnly: true,
      args: true,
    });
  }

  async run(client, message, args, ...query) {
    const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;

    const docFetch = await fetch(url);
    const embed = await docFetch.json();

    if(!embed || embed.error) {
        return message.reply(`"${query}" não pode ser localizado dentro da documentação do Discord.JS(<https://discord.js.org/>)`)
    }

    if(!message.guild) {
        return message.channel.send({ embed });
    }

    const msg = await message.channel.send({ embed });
    msg.react('🗑')

    let react;
    try {
        react = await msg.awaitReactions(
            (reaction, user) => reaction.emoji.name === '🗑' && user.id === message.author.id,
            { max: 1, time: 10000, errors: ['time'] }
        );
    } catch (error) {
        msg.reaction.removeAll()
    }

    if(react && react.first()) msg.delete();

    return message;
  }
}