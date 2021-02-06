const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../Database/Schemas/GuildConfig");
const Config = require("../../../Config/Config.json");
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = class HelppCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
        name: 'helpp',
        category: 'Accessibility',
        aliases: ['ajudaa'],
        usage: 'help || help <Comando>',
        description: 'Mostra todos os comandos e como utilizar-los'
    });
  }

  async run(client, message, [command], args) {
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requisitado por ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    if(command) {
        const cmd = client.commands.get(command) /*|| client.commands.get(aliases.get(command))*/;
        if(!cmd) return message.channel.send(`Comando Invalido: \`${command}\``)

        embed.setAuthor(`${client.Tools.capitalize(cmd.name)} Comando Help`, client.user.displayAvatarURL());
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
            `Parâmetros do Comando: \n \`<>\` = necessário \n \`[]\` = opcional`
        ])
        let categories;
        if(!Config.owners.includes(message.author.id)) {
            categories = client.Tools.removeDuplicates(client.commands.filter(cmd => cmd.category !== "Owner").map(cmd => cmd.category));
        } else {
            categories = client.Tools.removeDuplicates(client.commands.map(cmd => cmd.category || cmd.aliases));
        }
        for (const category of categories) {
            embed.addField(`**${client.Tools.Capitalize(category)}**`, client.commands.filter(cmd =>
                cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
        }
        return message.channel.send(embed);
    }
  }
}
