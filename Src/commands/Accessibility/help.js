const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const removeDuplicates = require("../../Tools/removeDuplicates");
const capitalise = require("../../Tools/capitalise");
const GuildConfig = require("../../database/schemas/GuildConfig");
const Config = require("../../../Config/Config.json");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super(
        'help', //name
        'Accessibility', //category
        ['ajuda'], // aliases
        'help || help <Comando>', //usage
        'Mostra todos os comandos e como utilizar-los' //description
    );
  }

  async run(client, message, [command], args) {
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requisitado por ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    if(command) {
        const cmd = client.commands.get(command) || client.commands.get(aliases.get(command));
        if(!cmd) return message.channel.send(`Comando Invalido: \`${command}\``)

        embed.setAuthor(`${capitalise(cmd.name)} Comando Help`, client.user.displayAvatarURL());
        embed.setDescription([
            `**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(" ") : "Nenhuma Aliases"}`,
            `**❯ Descrição:** ${cmd.description}`,
            `**❯ Categoria:** ${cmd.category}`,
            `**❯ Modo de Usar:** ${cmd.usage}`,
        ]);
        return message.channel.send(embed);
    } else {
        const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })
        embed.setDescription([
            `Esses são os comandos disponíveis`,
            `O prefix para esse servidor é ${guildConfig.prefix}`,
            `Parâmetros do Comando: \`<>\` = necessário & \`[]\` = opcional`
        ])
        let categories;
        if(!Config.owner.includes(message.author.id)) {
            categories = removeDuplicates(client.commands.filter(cmd => cmd.category !== "Owner").map(cmd => cmd.category));
        } else {
            categories = removeDuplicates(client.commands.map(cmd => cmd.category));
        }
        
        for(const category of categories) {
            embed.addField(`**${capitalise(category)}**`, client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${cmd.name}\``).join(" "));
        }
        return message.channel.send(embed);
    }
  }
}