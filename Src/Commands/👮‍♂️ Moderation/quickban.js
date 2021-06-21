const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class QuickBanCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "quickban",
      category: "👮‍♂️ Moderation",
      aliases: ["banirrapido"],
      usage: "quickban <mencione um usuário> [tempo de banimento] [motivo]",
      description: "Bane o usuário mencionado do servidor",
      userPerms: ["BAN_MEMBERS"],
    });
  }

  async run(client, message, args, tools, prefix) {
    try {
      const banEmoji = "<:MJb_banido:711695336363655198>";
      if (isNaN(args[1])) {
        var Days = "Permatente";
        var days = null;
        var Reason = args.slice(1).join(" ") || "Motivo não especificado";
      } else {
        var Days = `${args[1]} Dia(s)`;
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
          .setTitle(
            `${banEmoji} | Você foi Banido do servidor: ${message.guild.name}`
          )
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setThumbnail(Mention.user.displayAvatarURL())
          .setDescription(
            `Banido por: ${message.author}\n📰 Motivo: ${Reason}\n📅 Tempo do Banimento: ${Days}`
          )
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();
        await Mention.send(MentionEmbed);
        const target = message.guild.members.cache.get(Mention.id);
        target.ban({
          reason: `Banido por: ${message.author.tag} — 📰 Motivo: ${Reason} — 📅 Tempo do Banimento: ${Days}`,
          days: days,
        });
        ConfirmEmbed.edit(BanEmbed);
      }
    } catch (error) {
      if (error) {
        ConfirmEmbed.edit(
          new Discord.MessageEmbed()
            .setColor("#00c26f")
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setTitle("ERR0R")
            .setDescription(
              "Algum erro ocorreu e não consegui executar este comando corretamente 😥"
            )
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
        );
      }
    }
  }
};
