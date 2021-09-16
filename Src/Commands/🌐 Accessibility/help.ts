import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import { BaseCommand } from "@Structures/BaseCommand";
import * as Discord from "discord.js";
import Tools from "@Tools/Tools";

module.exports = class HelpCommand extends BaseCommand {
    constructor(client: NDBClient, ...args: any[]) {
        const name = "help";
        const options: CommandOptions = {
            client: client,
            name: "help",
            aliases: ["ajuda", "halp"],
            description: "Mostra todos os comandos e como utilizar-los",
            category: "🌐 Accessibility",
            usage: "[Comando]",
            userPerms: ["SEND_MESSAGES"],
            botPerms: [""],
            ownerOnly: false,
            SlashOptions: {
                name: "help",
                description: "Mostra todos os comandos e como utilizar-los",
                options: [
                    {
                        name: "comando",
                        description: "Mostra as informações do comando escolhido",
                        type: "STRING",
                        required: false
                    }
                ]
            }
        };
        super(client, name, options, args);
    }

    async run(client: NDBClient, message: any, [command], args: any) {
        const guildConfig = await client.MongoDB.FindGuildConfig(message.guild);

        const Timer = 120000

        var categories = [
            { value: "accessibility", label: "Accessibility", description: await client.translate("🌐 Accessibility/help:Selections:Description", message, { Category: "🌐 Accessibility" }), emoji: "🌐" },
            { value: "fun", label: "Fun", description: await client.translate("🌐 Accessibility/help:Selections:Description", message, { Category: "👌 Fun" }), emoji: "👌" },
            { value: "economy", label: "Economy", description: await client.translate("🌐 Accessibility/help:Selections:Description", message, { Category: "💸 Economy" }), emoji: "💸" },
        ]
        if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
            categories.unshift({ value: "settings", label: "Settings", description: await client.translate("🌐 Accessibility/help:Selections:Description", message, { Category: "⚙ Settings" }), emoji: "⚙" })
            categories.unshift({ value: "moderation", label: "Moderation", description: await client.translate("🌐 Accessibility/help:Selections:Description", message, { Category: "👮‍♂️ Moderation" }), emoji: "👮‍♂️" })
        }
        if (message.channel.nsfw) {
            categories.push({ value: "nsfw", label: "NSFW", description: await client.translate("🌐 Accessibility/help:Selections:Description", message, { Category: "🔞 NSFW" }), emoji: "🔞" })
        }
        if (client.Tools.checkOwner(message.author.id)) {
            categories.unshift({ value: "devtools", label: "Developer Tools", description: await client.translate("🌐 Accessibility/help:Selections:Description", message, { Category: "🛠 Developer Tools" }), emoji: "🛠" })
        }

        var CategoriesObject = [
            ...new Set([
                { value: "settings", category: "⚙ Settings" },
                { value: "accessibility", category: "🌐 Accessibility" },
                { value: "fun", category: "👌 Fun" },
                { value: "economy", category: "💸 Economy" },
                { value: "moderation", category: "👮‍♂️ Moderation" },
                { value: "nsfw", category: "🔞 NSFW" },
                { value: "devtools", category: "🛠 Developer Tools" }
            ])
        ]

        var CategoriesCase = CategoriesObject.map((object) => {
            return {
                value: object.value,
                category: object.category
            }
        })

        const Embed = new Discord.MessageEmbed()
            .setColor("#00c26f")
            .setAuthor(await client.translate("🌐 Accessibility/help:Menu:Author", message, { ARG: message.guild.name }), message.guild.iconURL({ dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(await client.translate("🌐 Accessibility/help:Menu:Footer", message, { ARG: message.author.tag }), message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        if (command) {
            const cmd = client.commands.get(command) /*|| client.commands.get(client.aliases.get(command))*/;
            if (!cmd) return message.reply({ content: `${await client.translate("🌐 Accessibility/help:Invalid", message), `\`${command}\``}` })
            Embed.setAuthor(await client.translate("🌐 Accessibility/help:Command:Author", message, { ARG: client.Tools.capitalize(cmd.name) }), client.user.displayAvatarURL())
            Embed.setDescription(`
                ${await client.translate("🌐 Accessibility/help:Command:Description:Aliases", message, { ARG: cmd.options.aliases.length ? cmd.options.aliases.map(alias => `\`${alias}\``).join(" | ") : await client.translate("🌐 Accessibility/help:Command:Description:NoAlias", message) })}
                ${await client.translate("🌐 Accessibility/help:Command:Description:Description", message, { ARG: `${await client.translate(`${cmd.options.category}/${cmd.name}:Help:Description`, message)}` })}
                ${await client.translate("🌐 Accessibility/help:Command:Description:Category", message, { ARG: cmd.options.category })}
                ${await client.translate("🌐 Accessibility/help:Command:Description:Usage", message, { ARG: `${guildConfig.prefix}${cmd.name} ${await client.translate(`${cmd.options.category}/${cmd.name}:Help:Usage`, message)}` })}
                `)
            return message.reply({ embeds: [Embed] });
        } else {
            const MenuEmbed = new Discord.MessageEmbed()
                .setTitle(await client.translate("🌐 Accessibility/help:Menu2:Title", message, { GuildName: message.guild.name }))
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("#00c26f")
                .setURL("http://discord.gg/5CHARxbaRk")
                .setDescription(await client.translate("🌐 Accessibility/help:Menu2:Description", message))
                .setFooter(client.user.tag, client.user.displayAvatarURL())
                .setTimestamp()
            const CategoriesComponent = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId("HelpCategories")
                        .setPlaceholder(await client.translate("🌐 Accessibility/help:Selections:Placeholder", message))
                        .addOptions(categories)
                )
            const ME = await message.reply({ embeds: [MenuEmbed], components: [CategoriesComponent] });

            const filter = (interaction) => interaction.user.id === message.author.id;

            const collector = ME.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: Timer })

            collector.on("collect", async (interaction) => {
                if (interaction.user.id !== message.author.id) return;

                const ComponentReaction = interaction.values[0]

                CategoriesCase.map(async (object) => {
                    switch (ComponentReaction) {
                        case String(object.value):
                            ME.edit({
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                                        .setTitle(object.category)
                                        .setColor("#00c26f")
                                        .addField(await client.translate("🌐 Accessibility/help:Menu2:Commands", message), client.commands.filter(cmd =>
                                            cmd.options.category === object.category).map(cmd => `\`${cmd.name}\``).join(' | '))
                                        .setFooter(client.user.tag, client.user.displayAvatarURL())
                                        .setTimestamp()
                                ]
                            })
                            break;
                    }
                })

            })
        }
    }

    async SlashRun(client: NDBClient, interaction: Discord.CommandInteraction, args: any) {

    }
};
