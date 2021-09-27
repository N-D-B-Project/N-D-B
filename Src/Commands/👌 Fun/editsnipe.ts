import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import { BaseCommand } from "@Structures/BaseCommand";
import * as Discord from "discord.js";

module.exports = class EditSnipeCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const name = "editsnipe";
    const options: CommandOptions = {
      client: client,
      name: "editsnipe",
      aliases: ["esnipe"],
      description: "Mostra a ultima mensagem editada no canal",
      category: "👌 Fun",
      usage: "",
      userPerms: ["SEND_MESSAGES"],
      botPerms: [""],
      ndcash: 500,
      SlashOptions: {
        name: "editsnipe",
        description: "Mostra a ultima mensagem editada no canal",
      },
    };
    super(client, name, options, args);
  }

  async run(client: NDBClient, message: any, args: any) {
    const msg = client.collections.editSnipe.get(message.channel.id)
    if (!msg || msg.check === false) return message.reply(await client.translate("👌 Fun/editsnipe:NoMsg", message))
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(msg.content)
      .addFields(
        { name: await client.translate("👌 Fun/editsnipe:OldMsg", message), value: msg.OldContent },
        { name: await client.translate("👌 Fun/editsnipe:NewMsg", message), value: msg.NewContent }
      )
      .setColor("#00c26f")
      .setFooter(await client.translate("👌 Fun/editsnipe:Footer", message))
      .setTimestamp()
    if (msg.image) embed.setImage(msg.image)

    message.reply({ embeds: [embed] })
  }

  async SlashRun(client: NDBClient, interaction: Discord.CommandInteraction, args: any) {
    const msg = client.collections.editSnipe.get(interaction.channel.id)
    if (!msg || msg.check === false) return interaction.followUp(await client.translate("👌 Fun/editsnipe:NoMsg", interaction))
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(msg.content)
      .addFields(
        { name: await client.translate("👌 Fun/editsnipe:OldMsg", interaction), value: msg.OldContent },
        { name: await client.translate("👌 Fun/editsnipe:NewMsg", interaction), value: msg.NewContent }
      )
      .setColor("#00c26f")
      .setFooter(await client.translate("👌 Fun/editsnipe:Footer", interaction))
      .setTimestamp()
    if (msg.image) embed.setImage(msg.image)

    interaction.followUp({ embeds: [embed] })
  }
};
