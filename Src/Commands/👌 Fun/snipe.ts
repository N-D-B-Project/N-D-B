import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import { BaseCommand } from "@Structures/BaseCommand";
import * as Discord from "discord.js";

module.exports = class SnipeCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const name = "snipe";
    const options: CommandOptions = {
      client: client,
      name: "snipe",
      aliases: [""],
      description: "Mostra a ultima mensagem deletada no canal",
      category: "👌 Fun",
      usage: "",
      userPerms: ["SEND_MESSAGES"],
      botPerms: [""],
      ndcash: 500,
      SlashOptions: {
        name: "snipe",
        description: "Mostra a ultima mensagem deletada no canal",
      }
    };
    super(client, name, options, args);
  }

  async run(client: NDBClient, message: any, args: any) {
    const msg = client.snipe.get(message.channel.id)
    if (!msg || msg.check === false) return message.reply(await client.translate("👌 Fun/snipe:NoMsg", message))
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(msg.content)
      .setColor("#00c26f")
      .setFooter(await client.translate("👌 Fun/snipe:Footer", message))
      .setTimestamp()
    if (msg.image) embed.setImage(msg.image)
    message.reply({ embeds: [embed] })
  }

  async SlashRun(client: NDBClient, interaction: Discord.CommandInteraction, args: any) {
    const msg = client.snipe.get(interaction.channel.id)
    if (!msg || msg.check === false) return interaction.followUp(await client.translate("👌 Fun/snipe:NoMsg", interaction))
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(msg.content)
      .setColor("#00c26f")
      .setFooter(await client.translate("👌 Fun/snipe:Footer", interaction))
      .setTimestamp()
    if (msg.image) embed.setImage(msg.image)
    interaction.followUp({ embeds: [embed] })
  }
};
