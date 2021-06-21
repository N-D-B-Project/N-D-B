const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class BanCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "ban",
      category: "👮‍♂️ Moderation",
      aliases: ["banir"],
      usage: "ban <mencione um usuário>  [tempo de banimento] [motivo]",
      description: "Bane o usuário mencionado do servidor",
      userPerms: ["BAN_MEMBERS"],
    });
  }

  async run(client, message, args, tools, prefix) {
    try {
      const banEmoji = "<:MJb_banido:711695336363655198>";
      const Timer = 120000;
      if(isNaN(args[1])) {
        var Days = "Permatente"
        var days = null;
        var Reason = args.slice(1).join(" ") || "Motivo não especificado";
      } else {
        var Days = `${args[1]} Dia(s)`
        var Reason = args.slice(2).join(" ") || "Motivo não especificado";
      }
      
      const Mention =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          (x) =>
            x.user.username.toLowerCase() === args.slice(0).join(" ") ||
            x.user.username === args[0]
        );
      if (!Mention) {
        message.inlineReply("Mencione quem você quer banir");
      } else {
        var ConfirmEmbed = await message.inlineReply(
          new Discord.MessageEmbed()
            .setTitle(`${banEmoji} Banimento`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setThumbnail(Mention.user.displayAvatarURL())
            .setDescription(
              `${message.author} Você está prestes a Banir: ${Mention}!\n 📰Motivo: ${Reason}\n 📅Tempo do Banimento: ${Days}`
            )
            .addFields(
              {
                name: `Reaja com: ${client.emoji.success}`,
                value: "Para confirmar o Banimento",
                inline: true,
              },
              {
                name: `Reaja com: ${client.emoji.fail}`,
                value: "Para para cancelar o Banimento",
                inline: true,
              }
            )
            .setFooter(`💡 Dica para banir sem ter que confirmar a ação utilize o comando ${prefix}quickban | ` + message.guild.name, message.guild.iconURL())
            .setTimestamp()
        );
        ConfirmEmbed.react(client.emoji.success);
        ConfirmEmbed.react(client.emoji.fail);
            
        const collector = ConfirmEmbed.createReactionCollector(
          (reaction, user) => user.id !== client.user.id,
          {
            time: Timer,
          }
        );
        
        collector.on("collect", async (reaction, user) => {
          if (user.id !== message.author.id) return;
        
          const ReactionEmoji = reaction.emoji.id || reaction.emoji.name || reaction.emoji;
          switch (ReactionEmoji) {
            case "719560623960096789":
              ConfirmEmbed.reactions.removeAll();
              const BanEmbed = new Discord.MessageEmbed()
                .setTitle(`${banEmoji} | Usuário Banido`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setThumbnail(Mention.user.displayAvatarURL())
                .setDescription(
                  `${Mention} quebrou as regras e  foi Banido por ${message.author}\n📰 Motivo: ${Reason}\n📅 Tempo do Banimento: ${Days}`
                )
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp();
              const MentionEmbed = new Discord.MessageEmbed()
                  .setTitle(`${banEmoji} | Você foi Banido do servidor: ${message.guild.name}`)
                  .setAuthor(message.author.tag, message.author.displayAvatarURL())
                  .setThumbnail(Mention.user.displayAvatarURL())
                  .setDescription(`Banido por: ${message.author}\n📰 Motivo: ${Reason}\n📅 Tempo do Banimento: ${Days}`)
                  .setFooter(message.guild.name, message.guild.iconURL())
                  .setTimestamp()
              await Mention.send(MentionEmbed);
              const target = message.guild.members.cache.get(Mention.id);
              target.ban({
                reason: `Banido por: ${message.author.tag} — 📰 Motivo: ${Reason} — 📅 Tempo do Banimento: ${Days}`,
                days: days,
              });
              ConfirmEmbed.edit(BanEmbed);
              break;
            case "719560576015138830":
              ConfirmEmbed.reactions.removeAll();
              const CancelEmbed = new Discord.MessageEmbed()
                .setTitle(`${banEmoji} | Usuário Banido`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setThumbnail(Mention.user.displayAvatarURL())
                .setDescription(
                  `${Mention} não foi Banido por ${message.author}\n📰 Motivo: Banimento Cancelado!\n📅 Tempo do Banimento: ${Days}`
                )
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp();
              ConfirmEmbed.edit(CancelEmbed);
              break;
          }
        });
      }
    } catch (error) {
      if(error) {
        ConfirmEmbed.edit(
          new Discord.MessageEmbed()
            .setColor("#00c26f")
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setTitle("ERR0R")
            .setDescription("Algum erro ocorreu e não consegui executar este comando corretamente 😥")  
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
        )
      }
    }
  }
};
