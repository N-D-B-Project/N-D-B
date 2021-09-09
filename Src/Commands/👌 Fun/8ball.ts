import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import { BaseCommand } from "@Structures/BaseCommand";
import * as Discord from "discord.js";
import Tools from "@Tools/Tools";

module.exports = class Command extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const name = "";
    const options: CommandOptions = {
      client: client,
      name: "8ball",
      aliases: ["eightball", "bolaoito"],
      description: "O Bot responde sua pergunta com algo aleatório",
      category: "👌 Fun",
      usage: "<Sua Pergunta>",
      userPerms: ["SEND_MESSAGES"],
      botPerms: [""],
      ownerOnly: false,
      SlashOptions: {
        name: "8ball",
        description: "O Bot responde sua pergunta com algo aleatório",
        options: [
          {
            name: "pergunta",
            description: "A sua pergunta",
            type: "STRING",
            required: true,
          },
        ],
      },
    };
    super(client, name, options, args);
  }

  async run(client: NDBClient, message: any, args: any, tools: Tools) {
    if (!args[0]) return message.reply(await client.translate("👌 Fun/8ball:NoQuestion", message));

    let result = Math.floor(Math.random() * tools.replies.length);
    let question = args.slice(0).join(" ");

    let Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(await client.translate("👌 Fun/8ball:Title", message))
      .setColor("#00c26f")
      .addField(await client.translate("👌 Fun/8ball:Question", message), question, true)
      .addField(await client.translate("👌 Fun/8ball:Reply", message), tools.replies[result], true)
      .setTimestamp()
    message.reply({ embeds: [Embed] });
  }

  async SlashRun(client: NDBClient, interaction: Discord.CommandInteraction, args: any, tools: Tools) {
    const result = Math.floor(Math.random() * tools.replies.length);
    const { value: question } = interaction.options.get("pergunta");

    const Embed = new Discord.MessageEmbed()
      .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
      .setTitle(await client.translate("👌 Fun/8ball:Title", interaction))
      .setColor("#00c26f")
      .addField(await client.translate("👌 Fun/8ball:Question", interaction), `${question}`, true)
      .addField(await client.translate("👌 Fun/8ball:Reply", interaction), tools.replies[result], true)
      .setTimestamp()
    interaction.followUp({ embeds: [Embed] });
  }
};
