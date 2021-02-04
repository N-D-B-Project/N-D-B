const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
// const mongoose = require("mongoose");
const mongo = require("../../Features/MongoDB");
const { languages } = require("../../../Config/Lang.json");
const  { setLanguage } = require("../../Features/Language");
const GuildConfig = require("../../database/schemas/GuildConfig");
// const LanguageSchema = require("../../database/schemas/Language");

// mongoose.connect(process.env.DBC, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

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
    // const guildConfig = await GuildConfig.findOne({
    //     guildId: message.guild.id
    // })

    if(!args[0]) message.channel.send(`Essas são as linguas suportadas: ${languages}`)

    const { guild } = message;

    const targetLanguage = args[0].toLowerCase();
    if(!languages.includes(targetLanguage)) {
        message.reply("Lingua não suportada");
        return;
    }

    setLanguage(guild, targetLanguage);

    await mongo().then(async (mongoose) => {
      try {
        await GuildConfig.findOneAndUpdate({ 
          //_Id: guild.id 
          guildId: guild.id
        }, { 
          //_Id: guild.id, 
          //_Name: guild.name,
          guildId: guild.id,
          guildName: guild.name,
          language: targetLanguage 
        }, { 
          upsert: true
        })

        message.reply("Lingua definida!").then((message) => {
          // const seconds = 3
          // message.delete({
          //   timeout: 1000 * seconds
          // })
        })
      } finally {
        mongoose.connection.close()
      }
    })

    // guildConfig.language = targetLanguage;
    // guildConfig.save().catch((err) => console.log("SetLang Error: " + err))
    // message.reply("Lingua definida!").then((message) => {
    //     const seconds = 3
    //     // message.delete({
    //     //     timeout: 1000 * seconds
    //     // })
    // })

  }
}