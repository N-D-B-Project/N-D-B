const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../database/schemas/GuildConfig");
//const {} = require("../../../Config/Abbreviations.js");
const lang = require("../../Config/Lang.json");

mongoose.connect(process.env.DBC, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const guildLanguages = {}

// const loadLanguages = async (client) = {
//  //guildConfig = await GuildConfig.findOne({ guildId: message.guild.id})
    // try {
    //     for(const guild of client.guilds.cache) {
    //         const guildId = guild[0];

    //         const result = await GuildConfig.findOne({ guildId: guildId});

    //         guildLanguages[guildId] = result ? result.language : 'pt-BR'
    //     }
    // } catch (error) {
    //     console.log("LanguageHandler Error: " + error)
// }
// }

// const setLanguage = (guild, language) = {
//     guildLanguages[guild.id] = language.toLowerCase()
// }

async function loadLanguages(client, message, args) {
    // const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id})
    try {
        for(const guild of client.guilds.cache) {
            const guildId = guild[0];

            const result = await GuildConfig.findOne({ guildId: guildId});

            guildLanguages[guildId] = result ? result.language : 'pt-BR'
        }
    } catch (error) {
        console.log("LanguageHandler Error: " + error)
    }
}

async function setLanguage(guild, language) {
    guildLanguages[guild.id] = language.toLowerCase()
}

module.exports = (guild, textId) => {
    if(!lang.translations[textId]) {
        throw new Error(`Id de texto desconhecido: "${textId}"`);
    }

    const selectedLanguages = guildLanguages[guild.id].toLowerCase();
    return lang.translations[textId][selectedLanguages];
}

module.exports = {
    loadLanguages,
    setLanguage
};