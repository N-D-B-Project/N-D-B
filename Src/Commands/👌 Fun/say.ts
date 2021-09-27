import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import BaseCommand from "@Structures/BaseCommand";
import * as Discord from "discord.js";

module.exports = class SayCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const name = "say";
    const options: CommandOptions = {
      client: client,
      name: "say",
      aliases: ["dizer", "diga", "falar", "fale"],
      description: "O Bot apaga sua mensagem e reenvia ela",
      category: "👌 Fun",
      usage: "<Mensagem>",
      userPerms: ["SEND_MESSAGES"],
      botPerms: [""],
      ownerOnly: false,
      SlashOptions: {
        name: "say",
        description: "Eu falo por você!",
        options: [
          {
            name: "conteúdo",
            description: "Oque eu vou falar",
            type: "STRING",
            required: true,
          },
        ],
      },
    };
    super(client, name, options, args);
  }

  async run(client: NDBClient, message: any, args: any) {
    const saymsg = args.join(" ");
    message.delete().catch((O_o: any) => { });
    message.channel.send({ content: saymsg });
  }

  async SlashRun(
    client: NDBClient,
    interaction: Discord.CommandInteraction,
    args: Array<any>
  ) {
    const { value: string } = interaction.options.get("conteúdo");
    interaction.followUp(`${string}`);
  }
};
