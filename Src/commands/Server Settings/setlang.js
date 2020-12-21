const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const mongoose = require("mongoose");
const { languages } = require("../../../Config/Lang.json");
const  { setLanguage } = require("../../utils/Language");
const GuildConfig = require("../../database/schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setlang',
      category: 'Server Settings',
      aliases: ['definirlingua'],
      usage: 'setlang <language>',
      description: 'Defini a lingua no qual o bot irá falar',
      userPerms: ["ADMINISTRATOR"],
    });
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
    })

    const { guild } = message;

    const targetLanguage = args[0].toLowerCase()
    if(!languages.includes(targetLanguage)) {
        message.reply("Lingua não suportada");
        return;
    }

    setLanguage(guild, targetLanguage);

    guildConfig.language = targetLanguage;
    guildConfig.save().catch((err) => console.log("SetLang Error: " + err))
    message.reply("Lingua definida!").then((message) => {
        const seconds = 3
        // message.delete({
        //     timeout: 1000 * seconds
        // })
    })

  }
}