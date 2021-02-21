const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const GuildConfig = require("../../Database/Schemas/GuildConfig");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setlang',
      category: 'Server Settings',
      aliases: ['definirlingua'],
      usage: 'setlang <language>',
      description: 'Define a lingua no qual o bot irá falar',
      userPerms: ["ADMINISTRATOR"],
    });
  }

  async run(client, message, args) {
    const languages = [
      "pt",
      "en",
      "es",
      "fr",
      "jp"
    ];

    if(!args[0]) return message.reply("Você não definiu a Lingua");
    const lang = args[0];
    if (!(languages.includes(args[0]))) return message.reply("Não sei falar essa lingua ainda!") 
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });
    if (guildConfig) {
      guildConfig.language = lang;
      guildConfig.save();
    } else {
        const NewGuildConfig = new GuildConfig({
          guildID: message.guild.id,
          language: lang
        });
        NewGuildConfig.save();
    }
  }
}