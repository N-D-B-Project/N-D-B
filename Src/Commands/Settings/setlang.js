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
      "it",
      "de",
      "ja",
      "ru",
      "ko",
      "zh-cn",
      "zh-tw",
    ];

    if(!args[0]) return message.reply(await client.translate("Você não definiu a Lingua", message));
    const lang = args[0];
    if (!(languages.includes(args[0]))) return message.reply(await client.translate("Não sei falar essa lingua ainda!", message)); 
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
        await NewGuildConfig.save();
    }
    message.channel.send(await client.translate(`Agora irei falar em: \`${guildConfig.language}\``, message))
    message.channel.send(await client.translate(`Bot está cerca de 90% traduzido!`, message))
  }
}