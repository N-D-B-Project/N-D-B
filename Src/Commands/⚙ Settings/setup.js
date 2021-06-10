const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const GuildConfig = require('../../Database/Schema/GuildConfig');
const GuildConfigRoles = require('../../Database/Schema/GuildRoles');
const GuildConfigChannels = require('../../Database/Schema/GuildChannel');

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

  async run(client, message, args, tools) {
        const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id })
        const guildConfigRoles = await GuildConfigRoles.findOne({ guildId: message.guild.id })
        const guildConfigChannels = await GuildConfigChannels.findOne({ guildId: message.guild.id })

        const prefix = tools.DataCheck(guildConfig.prefix);
        const DefaultRole = tools.DataCheck(guildConfigRoles.defaultRole);
        const MutedRole = tools.DataCheck(guildConfigRoles.mutedRole);
        const LogChannel = tools.DataCheck(guildConfigChannels.logChannel);
        const FloodChannel = tools.DataCheck(guildConfigChannels.floodChannel);
        
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
                    { name : "Prefix", value : "Reaja com 🔘 para definir o Prefixo do Bot" },
                    { name : "Cargos", value : "Reaja com 🔑 para ver as opções"},
                    { name : "Canais", value : "Reaja com 📖 para ver as opções"},
                    { name : "Sistemas", value : "Reaja com 💾 para ver as opções" }
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
                if(user.id !== message.author.id) return

                const ReactionEmoji = reaction.emoji.id || reaction.emoji.name;
                switch (ReactionEmoji) {
                    /* Infos */ case String("ℹ"):
                        HE.edit(
                            new Discord.MessageEmbed()
                                .setColor("#00c26f")
                                .setTitle("Bot Setup Info")
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                .setAuthor(message.guild.name, message.guild.iconURL())
                                .setDescription('Essas são as Configurações do Bot!')
                                .addFields( { name : "Prefix", value : prefix },
                                    { name : "DefaultRole", value : `${DefaultRole}: Cargo padrão do servidor, Serve para o sistema de Antiraid, Auto verificação, etc...` },
                                    { name : "MutedRole", value : `${MutedRole}: Cargo de mute do servidor, Serve para o sistema de Warns, Mute, etc...` },
                                    { name : "LogChannel", value : `${LogChannel}: Chat de logs do servidor, Serve para diversos sistemas com o intuito de passar o log das coisas que ocorrem com o servidor!` },
                                    { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                )
                                .setFooter(message.author.tag, message.author.displayAvatarURL())
                                .setTimestamp()
                        )
                        HE.reactions.removeAll()
                        HE.react("🏠")
                    break;
                    /* Prefix */ case String("🔘"):
                        const PrefixEmbed = new Discord.MessageEmbed()
                            .setTitle("Prefix")
                            .setColor("#00c26f")
                            .setDescription(`Prefixo definido: \`${prefix}\`\nDigite o Prefixo desejado abaixo!`)
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
                            .setDescription(`Novo prefix: \`${PrefixFMsg}\``)
                            .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                            .setTimestamp();
                        PrefixResponse.first().delete()
                        guildConfig.prefix = PrefixFMsg
                        
                        HE.edit(newPrefixEmbed)
                        HE.react("🏠")
                    break;
                    /* Roles */ case String("🔑"):
                        const RolesEmbed = new Discord.MessageEmbed()
                            .setColor("#00c26f")
                            .setTitle("Bot Setup Cargos")
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setAuthor(message.guild.name, message.guild.iconURL())
                            .setDescription('Essas são as opção de Configuração do Bot Referente a Cargos!')
                            .addFields(
                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal'},
                                { name : "Cargo Padrão", value : 'Reaja com 📦 para definir' },
                                { name : "Cargo Mute", value : 'Reaja com 🔇 para definir' },
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
                                /* Default Role */ case String("📦"):
                                    const DREmbed = new Discord.MessageEmbed()
                                        .setTitle("Cargo Padrão")
                                        .setColor("#00c26f")
                                        .setDescription(`Cargo: ${DefaultRole}\nDigite o Cargo desejado abaixo!`)
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
                                    DRResponse.first().delete()
                                    guildConfigRoles.defaultRole = DRFMsg
                                    HE.edit(newDREmbed)
                                    HE.react("🏠")
                                break;
                                /* Muted Role */ case String("🔇"):
                                    const MREmbed = new Discord.MessageEmbed()
                                        .setTitle("Cargo Mute")
                                        .setColor("#00c26f")
                                        .setDescription(`Cargo: ${MutedRole}\nDigite o Cargo desejado abaixo!`)
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
                                    MRResponse.first().delete()
                                    guildConfigRoles.mutedRole = MRFMsg
                                    HE.edit(newMREmbed)
                                    HE.react("🏠")
                                break;
                            }
                        });
                    break;
                    /* Channels */ case String("📖"):
                        const ChannelsEmbed = new Discord.MessageEmbed()
                            .setColor("#00c26f")
                            .setTitle("Bot Setup Canais")
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setAuthor(message.guild.name, message.guild.iconURL())
                            .setDescription('Essas são as opção de Configuração do Bot Referente a Canais!')
                            .addFields(
                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                { name : "Canal de Logs", value : 'Reaja com 🗞 para definir' },
                                { name : "Canal de Flood", value : 'Reaja com 😵 para definir' },
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
                                /* Log Channel */ case String("🗞"):
                                    const LCEmbed = new Discord.MessageEmbed()
                                        .setTitle("Canal de Logs")
                                        .setColor("#00c26f")
                                        .setDescription(`Canal: ${LogChannel}\nDigite o Canal desejado abaixo!`)
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
                                        .setDescription("Canal: " + LCFMsg)
                                        .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                                        .setTimestamp();
                                    LCResponse.first().delete()
                                    guildConfigChannels.logChannel = LCFMsg
                                    HE.edit(newLCEmbed)
                                    HE.react("🏠")
                                break;
                                /* Flood Channel */case String("😵"):
                                    const FCEmbed = new Discord.MessageEmbed()
                                        .setTitle("Canal de Flood")
                                        .setColor("#00c26f")
                                        .setDescription(`Canal: ${FloodChannel}\nDigite o Canal desejado abaixo!`)
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
                                        .setDescription("Canal: " + FCFMsg)
                                        .addFields( { name : "Menu", value: "Reaja com 🏠 para voltar ao menu principal" })
                                        .setTimestamp();
                                    FCResponse.first().delete()
                                    guildConfigChannels.floodChannel = FCFMsg
                                    HE.edit(newFCEmbed)
                                    HE.react("🏠")
                                break;
                            }
                        })
                    break;
                    /* Systens */ case String("💾"):
                        const SystemEmbed = new Discord.MessageEmbed()
                            .setColor("#00c26f")
                            .setTitle("Bot Setup Sistemas")
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setAuthor(message.guild.name, message.guild.iconURL())
                            .setDescription('Essas são as opção de Configuração do Bot Referente a Sistemas!')
                            .addFields(
                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                { name : "Anti-Spam", value : 'Reaja com 😆 para ativar ou desativar' },
                                { name : "Log de Mensagens Deletadas", value : 'Reaja com 🗑 para ativar ou desativar' },
                                { name: "Anti-Alt", value : 'Reaja com 🚫 para ativar ou desativar' },
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
                                /* Anti-Spam System */ case String("😆"):
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
                                                    { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                                )
                                                .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                .setTimestamp()
                                        )
                                        HE.reactions.removeAll()
                                        HE.react("🏠")
                                    } else if(guildConfigRoles.mutedRole === undefined || false) {
                                        HE.edit(
                                            new Discord.MessageEmbed()
                                                .setColor("#00c26f")
                                                .setTitle("Bot Setup Sistema de Anti-Spam")
                                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                .setAuthor(message.guild.name, message.guild.iconURL())
                                                .setDescription('Para você ativar esse sistema precisa primeiro é necessário definir o seguinte item:')
                                                .addFields(
                                                    { name : 'Cargo Mute', value : `Necessário para o bot aplicar o Mute quando ele infligir o Sistem ou remover o Mute quando o tempo passar` },
                                                    { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                                )
                                                .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                .setTimestamp()
                                        )
                                        HE.reactions.removeAll()
                                        HE.react("🏠")
                                    } else if(guildConfigChannels.logChannel === undefined || false) {
                                        HE.edit(
                                            new Discord.MessageEmbed()
                                                .setColor("#00c26f")
                                                .setTitle("Bot Setup Sistema de Anti-Spam")
                                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                .setAuthor(message.guild.name, message.guild.iconURL())
                                                .setDescription('Para você ativar esse sistema precisa primeiro é necessário definir o seguinte item:')
                                                .addFields(
                                                    { name : 'Canal de Logs', value : `Necessário para o bot avisar quando o Membro for Mutado e Desmutado pelo Sistema` },
                                                    { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
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
                                            .setTitle("Bot Setup Sistema de Anti-Spam")
                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                            .setDescription(`Sistema Anti-Spam!\nStatus: ${tools.DataCheck(guildConfig.antispam)}`)
                                            .addFields(
                                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                                { name : 'Ativar', value: 'Reaja com ✔' },
                                                { name : 'Desativar', value: 'Reaja com ❌' },
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
                                                    
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup Sistema de Anti-Spam")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema Anti-Spam Ativado!')
                                                            .addFields(
                                                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                                                { name : '💡 Dica: Flood', value : 'Caso o Servidor possua chat de Flood recomendo configura-lo na aba Channels do Menu!' },
                                                            )
                                                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                            .setTimestamp()
                                                    )
                                                    HE.reactions.removeAll()
                                                    HE.react("🏠")
                                                break;
                                                case String("❌"):
                                                    guildConfig.antispam = false;
                                                    
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup Sistema de Anti-Spam ")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema Anti-Spam Desativado!')
                                                            .addFields(
                                                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
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
                                /* Deleted Messages Log System */ case String("🗑"):
                                    if(guildConfigChannels.logChannel == undefined || false) {
                                        HE.edit(
                                            new Discord.MessageEmbed()
                                                .setColor("#00c26f")
                                                .setTitle("Bot Setup Sistema de Log das Mensagens Deletadas")
                                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                .setAuthor(message.guild.name, message.guild.iconURL())
                                                .setDescription('Para você ativar esse sistema precisa primeiro é necessário definir o seguinte item:')
                                                .addFields(
                                                    { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                                    { name : 'Canal de Log', value : `Necessário para o bot Enviar a mensagem apagada` },
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
                                                .setDescription(`Sistema Log de Mensagens Deletadas!\nStatus: ${tools.DataCheck(guildConfig.deletedLog)}`)
                                                .addFields(
                                                    { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                                    { name : 'Ativar', value: 'Reaja com ✔' },
                                                    { name : 'Desativar', value: 'Reaja com ❌' },
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
                                                    
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup DeletedLog System")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema de Log das Mensagens Deletadas Ativado!')
                                                            .addFields(
                                                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
                                                            )
                                                            .setFooter(message.author.tag, message.author.displayAvatarURL())
                                                            .setTimestamp()
                                                    )
                                                    HE.reactions.removeAll()
                                                    HE.react("🏠")
                                                break;
                                                case String("❌"):
                                                    guildConfig.deletedlog = false;
                                                    
                                                    HE.edit(
                                                        new Discord.MessageEmbed()
                                                            .setColor("#00c26f")
                                                            .setTitle("Bot Setup DeletedLog System")
                                                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                                            .setAuthor(message.guild.name, message.guild.iconURL())
                                                            .setDescription('Sistema de Log das Mensagens Deletadas Desativado!')
                                                            .addFields(
                                                                { name : 'Menu', value : 'Reaja com 🏠 para voltar ao menu principal' },
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
                    /* Home */ case String("🏠"):
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

            setInterval(() => {
                guildConfig.save().catch((err) => client.logger.error("GuildConfig Save Error: " + err))
                guildConfigChannels.save().catch((err) => client.logger.error("GuildConfigChannels Save Error: " + err))
                guildConfigRoles.save().catch((err) => client.logger.error("GuildConfigRoles Save Error: " + err))
            }, 1000) //! Save DBs every 1 second to prevent some bugs...

        } catch (error) {
            client.logger.error("Setup Error: " + error)
        }

    }
}

