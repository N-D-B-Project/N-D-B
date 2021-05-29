const BaseCommand = require("../../Utils/Structures/BaseCommand");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const Discord = require("discord.js");

const ReactionRole = require("../../Packages/ReactionRole/index.js");
const react = new ReactionRole();

module.exports = class ReactionTypesCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "reactiontypes",
      aliases: ["rrtype", "reactionroletypes", "rrtypes"],
      description: "Mostra todos os tipos de Reaction Roles",
      category: "🎨 ReactionRole",
    });
  }

  async run(client, message, args) {
    const embedType = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `1` - "Reagir adiciona o Cargo, tirar a reação remove o Cargo \n`2`- Reagir adiciona o Cargo, tirar a reação não remove o Cargo \n`3` - Reagir removerá o Cargo do usuário, tirar a reação não a devolverá o Cargo ao usuário \n`4` - Reagir removerá o Cargo, tirar a reação adiciona o Cargo \n`5` - Mesmo conceito do número 3 porém remove a reação do usuário\n`6` - Reagir para receber o Cargo e reagir novamene para remover o Cargo"
      )
      .setColor("#00c26f");

    message.channel.send(embedType);
  }
};
