const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const GuildConfig = require('../../Database/Schemas/GuildConfig');
const GuildConfigRoles = require('../../Database/Schemas/GuildRoles');
const GuildConfigChannels = require('../../Database/Schemas/GuildChannel');

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setup',
      category: '⚙ Settings',
      aliases: ['configurar'],
      usage: '',
      userPerms: ['MANAGE_GUILD'],
      description: 'Configure o Bot utilizando esse comando',
    });
  }

  async run(client, message, args) {
        const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })
        const guildConfigRoles = await GuildConfigRoles.findOne({ guildId: message.guild.id })
        const guildConfigChannels = await GuildConfigChannels.findOne({ guildId: message.guild.id })
        const Timer = 120000
        
        try {
            const HomeEmbed = new Discord.MessageEmbed()
                .setColor("#00c26f")
                .setTitle("Bot Setup")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription('Essas são as opção de Configuração do Bot!')
                .addFields( 
                    { name : "Informações sobre itens Configurados", value : "Reaja com ℹ" },
                    { name : "Prefix", value : "Reaja com 🔘" },
                    { name : "Cargos", value : "Reaja com 🔑"},
                    { name : "Canais", value : "Reaja com 📖"},
                    { name : "Sistemas", value : "Reaja com 💾" }
                )
            const HE = await message.inlineReply(HomeEmbed)
            HE.react("ℹ")
            HE.react("🔘") 
            HE.react("🔑")
            HE.react("📖")
            HE.react("💾")

            const collector = HE.createReactionCollector((reaction, user) => user.id !== client.user.id, {
                time: Timer
            });

            collector.on("collect", async (reaction, user) => {
                const ReactionEmoji = reaction.emoji.id || reaction.emoji.name;
                switch (ReactionEmoji) {
                    case String("ℹ"):
                        const prefix = guildConfig.prefix;
                        const DefaultRole = guildConfigRoles.defaultRole;
                        const MutedRole = guildConfigRoles.mutedRole;
                        const LogChannel = guildConfigChannels.logChannel;
                        HE.edit(
                            new Discord.MessageEmbed()
                                .setColor("#00c26f")
                                .setTitle("Bot Setup Info")
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                .setAuthor(message.guild.name, message.guild.iconURL())
                                .setDescription('Essas são as Configuração do Bot!')
                                .addFields( { name : "Prefix", value : prefix },
                                    { name : "DefaultRole", value : DefaultRole },
                                    { name : "MutedRole", value : MutedRole },
                                    { name : "LogChannel", value : LogChannel},
                                    { name : "Menu", value : "Reaja com 🏠" }
                                )
                                .setFooter(message.author.tag, message.author.displayAvatarURL())
                                .setTimestamp()
                        )
                        HE.reactions.removeAll()
                        HE.react("🏠")
                    break;
                    case String("🔘"):
                        const PrefixEmbed = new Discord.MessageEmbed()
                            .setTitle("Prefix")
                            .setColor("#00c26f")
                            .setDescription("Digite o Prefixo desejado no canal!")
                            .setTimestamp();
                        HE.edit(PrefixEmbed)
                        HE.reactions.removeAll()
                        const PrefixResponse = await message.channel.awaitMessages(
                            (msg) => msg.author.id === message.author.id,
                            {
                              max: 1,
                              time: 30000,
                            }
                        );
                        const PrefixFMsg = PrefixResponse.first().content
                        const newPrefixEmbed = new Discord.MessageEmbed()
                            .setTitle("✔ | Prefixo atualizado!")
                            .setColor("#00c26f")
                            .setDescription("Novo prefix: " + PrefixFMsg)
                            .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                            .setTimestamp();
                        //PrefixResponse.delete()
                        guildConfig.prefix = PrefixFMsg
                        guildConfig.save().catch((err) => client.logger.error("SetPrefix Error: " + err))
                        HE.edit(newPrefixEmbed)
                        HE.react("🏠")
                    break;
                    case String("🔑"):
                        const RolesEmbed = new Discord.MessageEmbed()
                            .setColor("#00c26f")
                            .setTitle("Bot Setup Cargos")
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setAuthor(message.guild.name, message.guild.iconURL())
                            .setDescription('Essas são as opção de Configuração do Bot Referente a Cargos!')
                            .addFields(
                                { name : "Cargo Padrão", value : 'Reaja com 📦' },
                                { name : "Cargo Mute", value : 'Reaja com 🔇' },
                                { name : 'Menu', value : 'Reaja com 🏠'}
                            )
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                            .setTimestamp()
                        HE.edit(RolesEmbed)
                        HE.reactions.removeAll()
                        HE.react("🏠")
                        HE.react("📦")
                        HE.react("🔇")

                        const RolesCollector = HE.createReactionCollector((reaction, user) => user.id !== client.user.id, {
                            time: Timer
                        });

                        RolesCollector.on("collect", async (reaction, user) => {
                            const RolesReactionEmoji = reaction.emoji.id || reaction.emoji.name;
                            switch (RolesReactionEmoji) {
                                case String("📦"):
                                    const DREmbed = new Discord.MessageEmbed()
                                        .setTitle("Cargo Padrão")
                                        .setColor("#00c26f")
                                        .setDescription("Digite o Cargo desejado no canal!")
                                        .setTimestamp();
                                    HE.edit(DREmbed)
                                    HE.reactions.removeAll()
                                    const DRResponse = await message.channel.awaitMessages(
                                        (msg) => msg.author.id === message.author.id,
                                        {
                                          max: 1,
                                          time: 30000,
                                        }
                                    );
                                    const DRFMsg = DRResponse.first().content
                                    const newDREmbed = new Discord.MessageEmbed()
                                        .setTitle("✔ | Cargo Definido!")
                                        .setColor("#00c26f")
                                        .setDescription("Cargo: " + DRFMsg)
                                        .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                                        .setTimestamp();
                                    guildConfigRoles.defaultRole = DRFMsg
                                    guildConfigRoles.save().catch((err) => client.logger.error("Set DefaultRole Error: " + err))
                                    HE.edit(newDREmbed)
                                    HE.react("🏠")
                                break;
                                case String("🔇"):
                                    const MREmbed = new Discord.MessageEmbed()
                                        .setTitle("Cargo Mute")
                                        .setColor("#00c26f")
                                        .setDescription("Digite o Cargo desejado no canal!")
                                        .setTimestamp();
                                    HE.edit(MREmbed)
                                    HE.reactions.removeAll()
                                    const MRResponse = await message.channel.awaitMessages(
                                        (msg) => msg.author.id === message.author.id,
                                        {
                                          max: 1,
                                          time: 30000,
                                        }
                                    );
                                    const MRFMsg = MRResponse.first().content
                                    const newMREmbed = new Discord.MessageEmbed()
                                        .setTitle("✔ | Cargo Definido!")
                                        .setColor("#00c26f")
                                        .setDescription("Cargo: " + MRFMsg)
                                        .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                                        .setTimestamp();
                                    guildConfigRoles.mutedRole = MRFMsg
                                    guildConfigRoles.save().catch((err) => client.logger.error("Set MutedRole Error: " + err))
                                    HE.edit(newMREmbed)
                                    HE.react("🏠")
                                break;
                            }
                        });
                    break;
                    case String("📖"):
                        const ChannelsEmbed = new Discord.MessageEmbed()
                            .setColor("#00c26f")
                            .setTitle("Bot Setup Canais")
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setAuthor(message.guild.name, message.guild.iconURL())
                            .setDescription('Essas são as opção de Configuração do Bot Referente a Canais!')
                            .addFields(
                                { name : "Canal de Logs", value : 'Reaja com 🗞' },
                                { name : "Canal de Flood", value : 'Reaja com 😵' },
                                { name : 'Menu', value : 'Reaja com 🏠'}
                            )
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                            .setTimestamp()
                        HE.edit(ChannelsEmbed)
                        HE.reactions.removeAll()
                        HE.react("🏠")
                        HE.react("🗞")
                        HE.react("😵")

                        const ChannelsCollector = HE.createReactionCollector((reaction, user) => user.id !== client.user.id, {
                            time: Timer
                        });

                        ChannelsCollector.on("collect", async (reaction, user) => {
                            const ChannelsReactionEmoji = reaction.emoji.id || reaction.emoji.name;
                            switch (ChannelsReactionEmoji) {
                                case String("🗞"):
                                    const LCEmbed = new Discord.MessageEmbed()
                                        .setTitle("Canal de Logs")
                                        .setColor("#00c26f")
                                        .setDescription("Digite o Cargo desejado no canal!")
                                        .setTimestamp();
                                    HE.edit(LCEmbed)
                                    HE.reactions.removeAll()
                                    const LCResponse = await message.channel.awaitMessages(
                                        (msg) => msg.author.id === message.author.id,
                                        {
                                          max: 1,
                                          time: 30000,
                                        }
                                    );
                                    const LCFMsg = LCResponse.first().content
                                    const newLCEmbed = new Discord.MessageEmbed()
                                        .setTitle("✔ | Canal Definido!")
                                        .setColor("#00c26f")
                                        .setDescription("Cargo: " + LCFMsg)
                                        .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                                        .setTimestamp();
                                    guildConfigChannels.logChannel = LCFMsg
                                    guildConfigChannels.save().catch((err) => client.logger.error("Set LogChannel Error: " + err))
                                    HE.edit(newLCEmbed)
                                    HE.react("🏠")
                                break;
                                case String("😵"):
                                    const FCEmbed = new Discord.MessageEmbed()
                                        .setTitle("Canal de Flood")
                                        .setColor("#00c26f")
                                        .setDescription("Digite o Cargo desejado no canal!")
                                        .setTimestamp();
                                    HE.edit(FCEmbed)
                                    HE.reactions.removeAll()
                                    const FCResponse = await message.channel.awaitMessages(
                                        (msg) => msg.author.id === message.author.id,
                                        {
                                          max: 1,
                                          time: 30000,
                                        }
                                    );
                                    const FCFMsg = FCResponse.first().content
                                    const newFCEmbed = new Discord.MessageEmbed()
                                        .setTitle("✔ | Canal Definido!")
                                        .setColor("#00c26f")
                                        .setDescription("Cargo: " + FCFMsg)
                                        .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                                        .setTimestamp();
                                    guildConfigChannels.floodChannel = FCFMsg
                                    guildConfigChannels.save().catch((err) => client.logger.error("Set FloodChannel Error: " + err))
                                    HE.edit(newFCEmbed)
                                    HE.react("🏠")
                                break;
                            }
                        })
                    break;
                    case String("💾"):
                        const SystemEmbed = new Discord.MessageEmbed()
                            .setColor("#00c26f")
                            .setTitle("Bot Setup Sistemas")
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setAuthor(message.guild.name, message.guild.iconURL())
                            .setDescription('Essas são as opção de Configuração do Bot Referente a Sistemas!')
                            .addFields(
                                { name : "Anti-Spam", value : 'Reaja com 😆' },
                                { name : "Log de Mensagens Deletadas", value : 'Reaja com 🗑' },
                                { name: "Anti-Alt", value : 'Reaja com 🚫' },
                                { name : 'Menu', value : 'Reaja com 🏠'}
                            )
                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                            .setTimestamp()
                        HE.edit(SystemEmbed)
                        HE.reactions.removeAll()
                        HE.react("🏠")
                        HE.react("😆")
                        HE.react("🗑")
                        HE.react("🚫")

                        const SystemCollector = HE.createReactionCollector((reaction, user) => user.id !== client.user.id, {
                            time: Timer
                        });

                        SystemCollector.on("collect", async (reaction, user) => {
                            const SystemReactionEmoji = reaction.emoji.id || reaction.emoji.name;
                            switch (SystemReactionEmoji) {
                                case String("😆"):
                                    if(guildConfigRoles.mutedRole === undefined || false && guildConfigChannels.logChannel === undefined || false) {
                                        HE.edit(
                                            new Discord.MessageEmbed()
                                                .setColor("#00c26f")
                                                .setTitle("Bot Setup Sistema de Anti-Spam")
                                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                .setAuthor(message.guild.name, message.guild.iconURL())
                                                .setDescription('Para você ativar esse sistema precisa primeiro é necessário definir os seguintes itens:')
                                                .addFields(
                                                    { name : 'Cargo Mute', value : `Necessário para o bot aplicar o Mute quando ele infligir o Sistem ou remover o Mute quando o tempo passar` },
                                                    { name : 'Canal de Logs', value : `Necessário para o bot avisar quando o Membro for Mutado e Desmutado pelo Sistema` },
                                                    { name : 'Menu', value : 'Reaja com 🏠'}
                                                )
                                                .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                .setTimestamp()
                                        )
                                        HE.reactions.removeAll()
                                        HE.react("🏠")
                                    } else {
                                        HE.edit(
                                            new Discord.MessageEmbed()
                                            .setColor("#00c26f")
                                            .setTitle("Bot Setup Anti-Spam System")
                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                            .setDescription('Sistema antispam!')
                                            .addFields(
                                                { name : 'Ativar', value: 'Reaja com ✔' },
                                                { name : 'Desativar', value: 'Reaja com ❌' },
                                                { name : 'Menu', value : 'Reaja com 🏠'}
                                            )
                                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                                            .setTimestamp()
                                        )
                                        HE.reactions.removeAll()
                                        HE.react("🏠")
                                        HE.react("✔")
                                        HE.react("❌")

                                        const SpamCollector = HE.createReactionCollector((reaction, user) => user.id !== client.user.id, {
                                            time: Timer
                                        });

                                        SpamCollector.on("collect", async (reaction, user) => {
                                            const SpamReactionEmoji = reaction.emoji.id || reaction.emoji.name;

                                            switch (SpamReactionEmoji) {
                                                case String("✔"):
                                                    guildConfig.antispam = true;
                                                    guildConfig.save().catch((err) => client.logger.error("AntiSpam Save Error " + error))
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup Anti-Spam System")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema antispam Ativado!')
                                                            .addFields(
                                                                { name : 'Flood', value : 'Caso o Servidor possua chat de Flood recomendo configura-lo na aba Channels do Menu!' },
                                                                { name : 'Menu', value : 'Reaja com 🏠'}
                                                            )
                                                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                            .setTimestamp()
                                                    )
                                                    HE.reactions.removeAll()
                                                    HE.react("🏠")
                                                break;
                                                case String("❌"):
                                                    guildConfig.antispam = false;
                                                    guildConfig.save().catch((err) => client.logger.error("AntiSpam Save Error " + error))
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup Sistema de Anti-Spam ")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema antispam Desativado!')
                                                            .addFields(
                                                                { name : 'Menu', value : 'Reaja com 🏠'}
                                                            )
                                                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                            .setTimestamp()
                                                    )
                                                    HE.reactions.removeAll()
                                                    HE.react("🏠")
                                                break;
                                            }
                                        });
                                    }
                                break;
                                case String("🗑"):
                                    if(guildConfigChannels.logChannel == undefined || false) {
                                        HE.edit(
                                            new Discord.MessageEmbed()
                                                .setColor("#00c26f")
                                                .setTitle("Bot Setup Sistema de Log das Mensagens Deletadas")
                                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                .setAuthor(message.guild.name, message.guild.iconURL())
                                                .setDescription('Para você ativar esse sistema precisa primeiro é necessário definir o seguinte item:')
                                                .addFields(
                                                    { name : 'Canal de Log', value : `Necessário para o bot Enviar a mensagem apagada` },
                                                    { name : 'Menu', value : 'Reaja com 🏠'}
                                                )
                                                .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                .setTimestamp()
                                        )
                                        HE.reactions.removeAll()
                                        HE.react("🏠")
                                    } else {
                                        HE.edit(
                                            new Discord.MessageEmbed()
                                                .setColor("#00c26f")
                                                .setTitle("Bot Setup Sistema de Log das Mensagens Deletadas")
                                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                .setAuthor(message.guild.name, message.guild.iconURL())
                                                .setDescription('Sistema Log de Mensagens Deletadas!')
                                                .addFields(
                                                    { name : 'Ativar', value: 'Reaja com ✔' },
                                                    { name : 'Desativar', value: 'Reaja com ❌' },
                                                    { name : 'Menu', value : 'Reaja com 🏠'}
                                                )
                                                .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                .setTimestamp()
                                        )
                                        HE.reactions.removeAll()
                                        HE.react("🏠")
                                        HE.react("✔")
                                        HE.react("❌")

                                        const DeletedLogCollector = HE.createReactionCollector((reaction, user) => user.id !== client.user.id, {
                                            time: Timer
                                        });
                                        
                                        DeletedLogCollector.on("collect", async (reaction, user) => {
                                            const DeletedLogReactionEmoji = reaction.emoji.id || reaction.emoji.name;
                                            switch (DeletedLogReactionEmoji) {
                                                case String("✔"):
                                                    guildConfig.deletedlog = true;
                                                    guildConfig.save().catch((err) => client.logger.error("DeletedLog Save Error " + error))
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup DeletedLog System")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema de Log das Mensagens Deletadas Ativado!')
                                                            .addFields(
                                                                { name : 'Menu', value : 'Reaja com 🏠'}
                                                            )
                                                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                            .setTimestamp()
                                                    )
                                                    HE.reactions.removeAll()
                                                    HE.react("🏠")
                                                break;
                                                case String("❌"):
                                                    guildConfig.deletedlog = false;
                                                    guildConfig.save().catch((err) => client.logger.error("DeletedLog Save Error " + error))
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup DeletedLog System")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema de Log das Mensagens Deletadas Desativado!')
                                                            .addFields(
                                                                { name : 'Menu', value : 'Reaja com 🏠'}
                                                            )
                                                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                            .setTimestamp()
                                                    )
                                                    HE.reactions.removeAll()
                                                    HE.react("🏠")
                                                break;
                                            }
                                        });
                                    }
                                break;
                                
                            }
                        });
                    break;
                    case String("🏠"):
                        HE.reactions.removeAll()
                        HE.edit(HomeEmbed)
                        HE.react("ℹ")
                        HE.react("🔘") 
                        HE.react("🔑")
                        HE.react("📖")
                        HE.react("💾")
                    break;
                }
            })
        } catch (error) {
            client.logger.error("SetupBeta Error: " + error)
        }

    }
}

