const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const { version: djversion } = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../Database/Schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { version } = require("../../../package.json");
const utc = require("moment");
const os = require("os");
const ms = require("ms");

module.exports = class BotInfoCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'botinfo',
      category: 'Info',
      aliases: [''],
      usage: '',
      description: 'Mostra as informações do Bot'
    });
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    });
    const FindPrefix = guildConfig.prefix;

    let description = [
      `**❯ <:github:761642337448755202>` + await client.translate(` ** [Clique na Estrela!]`, message) + `(${"https://github.com/NedcloarBR/N-D-B"})`,
      `**❯ <:discord:739591596248530985>` + await client.translate(` ** [Junte-se ao Server do meu Dev!]`, message) + `(${"https://discord.gg/mMapzad"})`,
      `**❯ <:topgg:761642656626769930>` + await client.translate(` ** [Vote no Top.gg]`, message) + `(Waiting approval)`,
      `**❯ <:discord:739591596248530985>` + await client.translate(` ** [Me Adicione ao seu Server!]`, message) + `(${"https://discord.com/oauth2/authorize?client_id=708822043420000366&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fredirect&scope=bot%20applications.commands"})`,

      await await client.translate(`**❯ Lista de Comandos: **`, message) + `\`${FindPrefix}help || helpp\``
    ]

    const core = os.cpus()[0]
    const embed = new Discord.MessageEmbed()
        .setTitle("Informações do Bot")
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("#00c26f")
        .addField(await client.translate("Geral", message), [
          await client.translate(`**❯ Client:**`, message) + `${client.user.tag} (${client.user.id})`,
          await client.translate(`**❯ Comandos:**`, message) + ` ${client.commands.size}`,
          await client.translate(`**❯ Servidores:**`, message) + ` ${client.guilds.cache.size.toLocaleString()}`,
          await client.translate(`**❯ Usuários:**`, message) + ` ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
          await client.translate(`**❯ Canais:**`, message) + ` ${client.channels.cache.size.toLocaleString()}`,
          await client.translate(`**❯ Criado em:**`, message) + ` ${utc(client.user.createdTimestamp).format("DD/MM/YYYY HH:mm:ss")}`,
          await client.translate(`**❯ Node.JS:**`, message) + ` ${process.version}`,
          await client.translate(`**❯ Discord.JS:**`, message) + ` v${djversion}`,
          await client.translate(`**❯ Bot Version:**`, message) + ` v${version}`,
            "\u200b"
        ])
        .addField(await client.translate("Informações do Sistema", message), [
          await client.translate(`**❯ Tamanho do Projeto:**`, message) + ` 312MB`,
          await client.translate(`**❯ Plataforma:**`, message) + ` ${process.platform}`,
          //`**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
          `**❯ CPU:**`,
          await client.translate(`\u3000 Cores:`, message) + ` ${os.cpus().length}`,
          await client.translate(`\u3000 Modelo:`, message) + ` ${core.model}`,
          await client.translate(`\u3000 Velocidade:`, message) + ` ${core.speed}MHz`,
          await client.translate(`**❯ Memoria:**`, message),
          await client.translate(`\u3000 Total: `, message) + `${client.Tools.formatBytes(process.memoryUsage().heapTotal)}`,
          await client.translate(`\u3000 Usado: `, message) + `${client.Tools.formatBytes(process.memoryUsage().heapUsed)}`,
        ])
        .setDescription(description)
        .setTimestamp();
    message.channel.send(embed);
  }
}