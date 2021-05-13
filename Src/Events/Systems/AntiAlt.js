const BaseEvent = require('../../utils/structures/BaseEvent');
const Discord = require('discord.js');
const moment = require('moment')
const GuildConfig = require("../../Database/Schemas/GuildConfig")
const GuildConfigChannels = require("../../Database/Schemas/GuildChannel");

module.exports = class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(client, member) {
    // const guildConfig = await GuildConfig.findOne({ guildId: member.guild.id });
    // const guildConfigChannels = await GuildConfigChannels.findOne({ guildId: member.guild.id });
    // const FindChannel = guildConfigChannels.logChannel;
    // const Channel = client.channels.cache.get(FindChannel);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa")

    //if(guildConfig.antialt == undefined || false) return;

    //if(guildConfig.antialt == true) {
      // console.log("aaaaaa")
      // if(Date.now - member.user.createdAt <1000*60*60*24*1) {
      //   const embed = new Discord.MessageEmbed()
      //     .setColor('#00c26f')
      //     .setAuthor('\u200b', client.user.displayAvatarURL())
      //     .setDescription(`⚠ **Possível Conta Alt!**
      //       Usuário: ${member.user}
      //       Criado em: ${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()} @ **${moment(member.user.createdAt).format('hh:mm a')}**
      //       *Verifique se essa conta possa ser uma Alt de algum membro banido (Verifique pelo nome, foto de perfil, etc...)*`)
      //     .setFooter(`ID: ${member.id}`)
      //     .setTimestamp();
      //   Channel.send(embed)
      //   const msg = await Channel.send("Você deseja expulsar esse membro?")
      //   msg.react("👍")
      //   msg.react("👎")
  
      //   msg.awaitReactions((reaction, user) => (reaction.emoji.name == "👍" || reaction.emoji.name == "👎") && (user.id !== client.user.id), { max: 1, time: 600000, erros: ['time'] })
      //     .then(collected => {
      //       const reaction = collected.first();
      //       if (reaction.emoji.name === '👍') {
      //           member.kick({
      //             reason: "Possível Conta Alt"
      //           })
      //           return msg.edit('Usuário Expulso')
      //       } else if (reaction.emoji.name === '👎') {
      //          return msg.edit('Usuário não Expulso')
      //       }
      //     })
      //     .catch(collected => {
            
      //     })
      //     .catch(error => {
      //       client.logger.error(error)
      //     });
      //}
    //}
  }
}