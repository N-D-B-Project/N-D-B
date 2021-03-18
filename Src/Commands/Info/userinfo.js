const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const moment = require('moment');
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class UserInfoCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'userinfo',
      category: 'Info',
      aliases: [''],
      usage: 'userinfo <mencione um usuário>',
      description: 'Mostra suas informações ou do usuário mencionado'
    });
  }

  async run(client, message, [target], args) {
    const Membro = message.mentions.users.last() || message.guild.members.cache.get(target) || message.member || message.author;
    const Cargos = Membro.roles.cache
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .slice(0, -1);
    const userFlags = Membro.user.flags.toArray();
    const MembroStatus = Membro.user.presence.status;

    if(MembroStatus === "online") {
      var status = "<:online:734891023657992394>"
    } else if(MembroStatus === "dnd") {
      var status = "<:dnd:734891023729295421>"
    } else if(MembroStatus === "idle") {
      var status = "<:idle:734891023930491012>"
    } else if(MembroStatus === "offline") {
      var status = "<:off:734891023951724564>"
    }
  
    const embed = new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setThumbnail(Membro.user.displayAvatarURL({dynamic: true, size: 512}))
      .addField(await client.translate("Usuário", message), [
        await client.translate(`**❯ Username:**`, message) + ` ${Membro.user.username}`,
				await client.translate(`**❯ Descriminador:**`, message) + ` ${Membro.user.discriminator}`,
				await client.translate(`**❯ ID:**`, message) + ` ${Membro.id}`,
				await client.translate(`**❯ Insignias:**`, message) + ` ${userFlags.length ? userFlags.map(flag => client.Tools.userDetails[flag]).join(', ') : client.translate('Nenhum', message)}`,
				await client.translate(`**❯ Avatar:** [Download Avatar]`, message) + `(${Membro.user.displayAvatarURL({ dynamic: true })})`,
				await client.translate(`**❯ Conta criada em:**`, message) + ` ${moment(Membro.user.createdTimestamp).format('LT')} ${moment(Membro.user.createdTimestamp).format('DD/MM/YYYY')} ${moment(Membro.user.createdTimestamp).fromNow()}`,
				await client.translate(`**❯ Status:**`, message) + ` ${status}`,
				await client.translate(`**❯ Jogo:**`, message) + ` ${Membro.user.presence.game || client.translate('Não esta jogando nada', message)}`,
				`\u200b`
			])
			.addField('Membro', [
				await client.translate(`**❯ Maior Cargo:**`, message) + ` ${Membro.roles.highest.id === message.guild.id ? client.translate('Nenhum', message) : Membro.roles.highest.name}`,
				await client.translate(`**❯ Entrou em:**`, message) + ` ${moment(Membro.joinedAt).format('LL LTS')}`,
				await client.translate(`**❯ Cargo Hoist:**`, message) + ` ${Membro.roles.hoist ? Membro.roles.hoist.name : client.translate('Nenhum', message)}`,
				await client.translate(`**❯ Cargos`, message) + ` [${Cargos.length}]:** ${Cargos.length < 10 ? Cargos.join(', ') : Cargos.length > 10 ? client.Tools.trimArray(Cargos) : client.translate('Nenhum', message)}`,
				`\u200b`
      ]);
    message.channel.send(embed);
  }
};
