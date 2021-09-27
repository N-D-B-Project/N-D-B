import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import BaseCommand from "@Structures/BaseCommand";
import * as Discord from "discord.js";

module.exports = class AntiSnipeCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const name = "antisnipe";
    const options: CommandOptions = {
      client: client,
      name: "antisnipe",
      aliases: ["asnipe"],
      description: "Oculta o Snipe da ultima mensagem apagada ou editada",
      category: "",
      usage: "",
      userPerms: ["SEND_MESSAGES"],
      botPerms: [""],
      ndcash: 1000,
      SlashOptions: {
        name: "antisnipe",
        description: "Oculta o Snipe da ultima mensagem apagada ou editada",
      },
    };
    super(client, name, options, args);
  }

  async run(client: NDBClient, message: any, args: any) {
    client.collections.snipe.set(message.channel.id, {
      check: false,
      content: null,
      author: null,
      image: null
    })
    client.collections.editSnipe.set(message.channel.id, {
      check: false,
      OldContent: null,
      NewContent: null,
      author: null,
      image: null
    })
    message.reply(await client.translate("👌 Fun/antisnipe:Occulted", message))
  }

  async SlashRun(client: NDBClient, interaction: Discord.CommandInteraction, args: any) {
    client.collections.snipe.set(interaction.channel.id, {
      check: false,
      content: null,
      author: null,
      image: null
    })
    client.collections.editSnipe.set(interaction.channel.id, {
      check: false,
      OldContent: null,
      NewContent: null,
      author: null,
      image: null
    })
    interaction.followUp({ content: await client.translate("👌 Fun/antisnipe:Occulted", interaction), ephemeral: true })
  }
};
