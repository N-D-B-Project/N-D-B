const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../Database/Schemas/GuildConfig");
const Config = require("../../../Config/Config.json");
//const {} = require("../../../Config/Abbreviations.js");
const color = require("../../../Config/Colours.json");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = class HelpCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
        name: 'help',
        category: 'Accessibility',
        aliases: ['ajuda'],
        usage: 'help || help <Comando>',
        description: 'Mostra todos os comandos e como utilizar-los'
    });
  }

  async run(client, message, [command], args) {
    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })
    
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requisitado por ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    if(!command) {
        const MenuEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(color.bot_grenn)
            .setDescription("**__Reaja de acordo com a categoria desejada__**")
            .addField("Categorias", "Anime = 🗻\nMusic = 🎶\nEconomy = 💵\nLevelXP = 🆙\nFun = 😄\nSocial = 👨‍👩‍👧‍👧\nModeration = 🛠")
        const MenuReact = await message.channel.send(MenuEmbed);

        MenuReact.react("🗻");
        MenuReact.react("🎶");
        MenuReact.react("💵");
        MenuReact.react("🆙");
        MenuReact.react("😄");
        MenuReact.react("👨‍👩‍👧‍👧");
        MenuReact.react("🛠");
        //MenuReact.react("");
        
    } else {
        const cmd = client.commands.get(command) /*|| client.commands.get(client.aliases.get(command))*/;
        if(!cmd) return message.channel.send(`Comando Invalido: \`${command}\``)

        embed.setAuthor(`${client.Tools.capitalize(cmd.name)} Comando Help`, client.user.displayAvatarURL());
        embed.setDescription([
            `**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(" ") : "Nenhuma Aliases"}`,
            `**❯ Descrição:** ${cmd.description}`,
            `**❯ Categoria:** ${cmd.category}`,
            `**❯ Modo de Usar:** ${guildConfig.prefix}${cmd.usage}`,
        ]);
        return message.channel.send(embed);
    }
  }
}
