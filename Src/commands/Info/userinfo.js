const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const userDetails = require("../../Tools/userDetails");
const moment = require('moment');
const trimArray = require("../../Tools/trimArray");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class UserInfoCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'userinfo', //name
      category: 'Info', //category
      aliases: [''], //aliases
      usage: 'userinfo <mencione um usuário>', //usage
      description: 'Mostra suas informações ou do usuário mencionado' //description
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
      .setColor(Membro.displayHexColor || "RANDOM")
      .setThumbnail(Membro.user.displayAvatarURL({dynamic: true, size: 512}))
      .addField("Usuário", [
        `**❯ Username:** ${Membro.user.username}`,
				`**❯ Descriminador:** ${Membro.user.discriminator}`,
				`**❯ ID:** ${Membro.id}`,
				`**❯ Insignias:** ${userFlags.length ? userFlags.map(flag => userDetails[flag]).join(', ') : 'Nenhum'}`,
				`**❯ Avatar:** [Download Avatar](${Membro.user.displayAvatarURL({ dynamic: true })})`,
				`**❯ Conta criada em:** ${moment(Membro.user.createdTimestamp).format('LT')} ${moment(Membro.user.createdTimestamp).format('DD/MM/YYYY')} ${moment(Membro.user.createdTimestamp).fromNow()}`,
				`**❯ Status:** ${status}`,
				`**❯ Game:** ${Membro.user.presence.game || 'Não esta jogando nada'}`,
				`\u200b`
			])
			.addField('Membro', [
				`**❯ Maior Cargo:** ${Membro.roles.highest.id === message.guild.id ? 'Nenhum' : Membro.roles.highest.name}`,
				`**❯ Entrou em:** ${moment(Membro.joinedAt).format('LL LTS')}`,
				`**❯ Cargo Hoist:** ${Membro.roles.hoist ? Membro.roles.hoist.name : 'Nenhum'}`,
				`**❯ Cargos [${Cargos.length}]:** ${Cargos.length < 10 ? Cargos.join(', ') : Cargos.length > 10 ? trimArray(Cargos) : 'Nenhum'}`,
				`\u200b`
      ]);
    message.channel.send(embed);
  }
};
