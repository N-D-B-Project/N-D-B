const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const { version: djsversion } = require("discord.js");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const { version } = require("../../../package.json");
const moment = require("moment");
require("moment-duration-format")
const os = require("os");
const core = os.cpus()[0]

module.exports = class BotInfoCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'botinfo',
      category: 'ℹ Info',
      aliases: ['binfo', 'about', 'sobre'],
      usage: '',
      description: 'Mostra as informações do Bot!',
    });
  }

  async run(client, message, args, tools) {
    try {
        const guildConfig = await GuildConfig.findOne({
            guildId: message.guild.id
        });
        const FindPrefix = guildConfig.prefix;

        const PingEmbed = new Discord.MessageEmbed()
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setColor("#00c26f")
            .setDescription("Pinging...")
            .setFooter("Ping")
            .setTimestamp();
        const ms = await message.inlineReply(PingEmbed)

        const description = [
            "",
            "Bot Brasileiro com diversos tipos de comandos e sistemas com foco em melhorar seu servidor!",
            "Comandos e Sistemas de Moderação",
            "Comandos de Musica, Interação entre usuários e mais!",
            `**Lista de Comandos: **` + `\`${FindPrefix}help\``
        ];

        const suporte = [
            `**<:github:761642337448755202> ** [Clique na Estrela!]` + `(${"https://github.com/NedcloarBR/N-D-B"})`,
            `**<:discord:739591596248530985> ** [Junte-se ao Server do meu Dev!]` + `(${"https://discord.gg/mMapzad"})`,
            `**<:topgg:761642656626769930> ** [Vote no Top.gg]` + `(https://top.gg/bot/708822043420000366)`,
            `**<:discord:739591596248530985> ** [Me Adicione ao seu Server!]` + `(${"https://discord.com/oauth2/authorize?client_id=708822043420000366&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fredirect&scope=bot%20applications.commands"})`,
        ];
        const geral = [
            `**👑 Criador**: NedcloarBR#0026`,
            `**🖥 Client: **` + `${client.user.tag} (${client.user.id})`,
            `**✉ Comandos: **` + ` ${client.commands.size}`,
            `**🌐 Servidores: **` + ` ${client.guilds.cache.size.toLocaleString()}`,
            `**:busts_in_silhouette: Usuários: **` + ` ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
            `**📺 Canais: **` + ` ${client.channels.cache.size.toLocaleString()}`,
            `**🎂 Criado em: **` + ` ${moment.utc(client.user.createdTimestamp).format("DD/MM/YYYY HH:mm:ss")}`,
                "\u200b"
        ];
        const botversion = [
            `**👨‍💻 Node.JS: **` + ` ${process.version}`,
            `**🌌 Discord.JS: **` + ` v${djsversion}`,
            `**🆚 Bot Version: **` + ` v${version}`,
                "\u200b"
        ];
        const sistema = [
            `**Tamanho do Projeto: **` + ` 387MB`,
            `**Plataforma: **` + ` ${tools.CheckPlatform(process.platform)}`,
            //`** Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
            `**CPU: **`,
            `\u3000 Cores: ` + ` ${os.cpus().length}`,
            `\u3000 Modelo: ` + ` ${core.model}`,
            `\u3000 Velocidade: ` + ` ${core.speed}MHz`,
            `** Memoria:**`,
            `\u3000 Total: ` + `${tools.formatBytes(process.memoryUsage().heapTotal)}`,
            `\u3000 Usado: ` + `${tools.formatBytes(process.memoryUsage().heapUsed)}`,
        ];

        const uptime = moment.duration(client.uptime).format(" D [Dias], H [Horas], m [Minutos], s [Segundos]");
        const pingtime = [
            `**⏳ Ping: **📡A latencia é ${Math.floor(ms.createdTimestamp - message.createdTimestamp )}ms.\n🖥A latencia da API é ${client.ws.ping}ms`,
            `**⏰ Uptime: **${uptime}`
        ]
    
        
        ms.edit(
            new Discord.MessageEmbed()
                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                .setColor("#00c26f")
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle("ℹ Sobre mim")
                .setDescription(description)
                .addFields(
                    { name: "💨 Geral", value: geral, inline: false},
                    { name: "💫 Versão", value: botversion, inline: true },
                    { name: "🗯 Sistema", value: sistema, inline: true },
                    { name: "⌚ Ping/Uptime", value: pingtime, inline: true }, 
                    { name: "💹 Suporte", value: suporte, inline: true}
                )
                .setFooter(`Bot info requisitado por: ` + message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
            )
    
    } catch (error) {
        client.logger.error(error)
    }
  }
}