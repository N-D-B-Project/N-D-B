const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const Config = require("../../Config/Config.json");
//const {} = require("../../../Config/Abbreviations.js");
const color = require("../../Config/Colours.json");

module.exports = class HelpCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
        name: 'help',
        category: '🌐 Accessibility',
        aliases: ['ajuda', 'halp'],
        usage: '<Comando>',
        description: 'Mostra todos os comandos e como utilizar-los'
    });
  }

  async run(client, message, [command], args, tools) {
    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })
    const Timer = 120000
    var Categorias
    if(message.member.hasPermission("MANAGE_GUILD")) {
        Categorias = "🎵 Music = 🎵\n💸 Economy = 💵\n👌 Interaction = 👌\n👮‍♂️ Moderation = 👮‍♂️"
    } else if(!message.member.hasPermission("MANAGE_GUILD")) {
        Categorias = "🎵 Music = 🎵\n💸 Economy = 💵\n👌 Interaction = 👌"
    }
    
    const embed = new Discord.MessageEmbed()
        .setColor("#00c26f")
        .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requisitado por ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    if(command) {
        const cmd = client.commands.get(command) /*|| client.commands.get(client.aliases.get(command))*/;
        if(!cmd) return message.channel.send(`Comando Invalido: \`${command}\``)

        embed.setAuthor(`${client.Tools.capitalize(cmd.name)} Comando Help`, client.user.displayAvatarURL());
        embed.setDescription([
            `**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(" ") : "Nenhuma Aliases"}`,
            `**❯ Descrição:** ${cmd.description}`,
            `**❯ Categoria:** ${cmd.category}`,
            `**❯ Modo de Usar:** ${guildConfig.prefix}${cmd.name}${cmd.usage}`,
        ]);
        return message.channel.send(embed);
        
    } else {
        const MenuEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("#00c26f")
            .setDescription("**__Reaja de acordo com a categoria desejada__**")
            .addField("Categorias", Categorias)
        const ME = await message.inlineReply(MenuEmbed);

        ME.react("🎵");
        ME.react("💵");
        ME.react("👌");
        if(message.member.hasPermission("MANAGE_GUILD")) {
            ME.react("👮‍♂️");
        }
        
        const collector = ME.createReactionCollector((reaction, user) => user.id !== client.user.id, {
            time: Timer
        });
        
        collector.on("collect", async (reaction, user) => {
            const ReactionEmoji = reaction.emoji.id || reaction.emoji.name;
            switch(ReactionEmoji) {
                case String("🎵"):
                    ME.edit(
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                            .setTitle("🎵 Music")
                            .setColor("#00c26f")
                            .addField(`**Comandos**`, client.commands.filter(cmd =>
                                cmd.category === "🎵 Music").map(cmd => `\`${cmd.name}\``).join(' | '))
                    )
                    ME.reactions.removeAll();
                    ME.react("🏠")
                break;
                case String("💵"):
                    ME.edit(
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                            .setTitle("💸 Economy")
                            .setColor("#00c26f")
                            .addField(`**Comandos**`, client.commands.filter(cmd =>
                                cmd.category === "💸 Economy").map(cmd => `\`${cmd.name}\``).join(' | '))
                    )
                    ME.reactions.removeAll();
                    ME.react("🏠")
                break;
                case String("👮‍♂️"):
                    ME.edit(
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                            .setTitle("👮‍♂️ Moderation")
                            .setColor("#00c26f")
                            .addField(`**Comandos**`, client.commands.filter(cmd =>
                                cmd.category === "👮‍♂️ Moderation").map(cmd => `\`${cmd.name}\``).join(' | '))
                    )
                    ME.reactions.removeAll();
                    ME.react("🏠")
                break;


                case String("👌"):
                    ME.edit(
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                            .setTitle("👌 Interaction")
                            .setColor("#00c26f")
                            .addField(`**Comandos**`, client.commands.filter(cmd =>
                                cmd.category === "👌 Interaction").map(cmd => `\`${cmd.name}\``).join(' | '))
                    )
                    ME.reactions.removeAll();
                    ME.react("🏠")
                break;

                case String("🏠"):
                    ME.edit(MenuEmbed)
                    ME.reactions.removeAll();
                    ME.react("🎵");
                    ME.react("💵");
                    ME.react("👌");
                    if(message.member.hasPermission("MANAGE_GUILD")) {
                        ME.react("👮‍♂️");
                    }
                break;
            }
        });
    }
  }
}
