// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
// Apenas NedcloarBR Server
/*
const BaseEvent = require('../../utils/structures/BaseEvent');
const Discord = require("discord.js");

module.exports = class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(client, member, message) {
    const guild = client.guilds.cache.get("679066351456878633");
    const channel = client.channels.cache.get("683409840638263297");

    const carregando = member.guild.emojis.cache.find(emoji => emoji.id === "718196232757182566");
    const verificado = member.guild.emojis.cache.find(emoji => emoji.id === "719710630881525881");
    //const welcomegif = require("../Models/Gif/welcome.gif");
    
    if(guild != member.guild) {
      return console.log("Usuário entrou em outro Server...")
    } else {
      const welcome = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(`${carregando} Bem Vindo(a)! ${verificado}`)
        .setImage(`${welcomegif}`)
        .setDescription(`${member.user} Bem Vindo(a) ao servidor ${guild.name}! Número de membros: ${member.guild.memberCount} Veja as regras no chat #regras!`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024}))
        .setFooter("ID do Usuáurio" + member.user.id)
        .setTimestamp();

      message.channel.send(welcome)
    }  
  }
}
*/