const BaseCommand = require('../../Utils/Structures/BaseCommand');
const Discord = require('discord.js');
//const {} = require("../../../Config/Abbreviations.js");
const GuildConfig = require("../../Database/Schema/GuildConfig");

module.exports = class AntiRaidCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'antiraid',
      category: '👮‍♂️ Moderation',
      aliases: ['lockdown'],
      usage: 'antiraid on | off>',
      description: 'Bloqueia o servidor inteiro para nenhum membro mandar mensagens',
      userPerms: ["MANAGE_GUILD"]
    });
  }

  async run(client, message, args, tools, prefix) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    })
    const FindRole = guildConfig.defaultRole;
    const Membros = message.guild.roles.cache.find(r => r.id === `${FindRole}`);
    const Mention = message.author;
    const Content = message.content;

    const SintaxErr = new Discord.MessageEmbed()
      .setTitle("❌ | Erro de Sintaxe")
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setColor("#00c26f")
      .setDescription(`O método correto de utilizar o comando é: ${prefix}lockdown on | off`)
      .setTimestamp()
    if(!args[0]) return message.inlineReply(`${Mention} ${SintaxErr}`);
    else if (Content.includes("on")) {
      await Membros.setPermissions(67174465).catch(console.error);
      await message.inlineReply(/*`O Sistema de AntiRaid foi Ligado por ${Mention}`*/
        new Discord.MessageEmbed()
          .setTitle("Sistema AntiRaid")  
          .setAuthor(client.user.tag, client.user.displayAvatarURL())
          .setColor("#00c26f")
          .setDescription(`O Sistema de AntiRaid foi Ligado por ${Mention}`)
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp()
      );
    } else if (Content.includes("off")) {
      await Membros.setPermissions(133684545).catch(console.error);
      await message.inlineReply(/*`O Sistema de AntiRaid foi Desligado por ${Mention}`*/
        new Discord.MessageEmbed()
          .setTitle("Sistema AntiRaid")  
          .setAuthor(client.user.tag, client.user.displayAvatarURL())
          .setColor("#00c26f")
          .setDescription(`O Sistema de AntiRaid foi Desligado por ${Mention}`)
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp()
      );
    }
  }
}