import NDBClient from "@/Client/Client";
import BaseCommand from "@Structures/BaseCommand";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class InteractionCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "interactionCreate";
    const options = {
      name: "interactionCreate",
      type: "once",
    };

    super(client, name, options);
  }

  async run(client: NDBClient, interaction: Discord.CommandInteraction) {
    if (process.env.Debug === "True") console.log(interaction);

    if (!interaction.guild) return;

    if (interaction.isCommand()) {
      await interaction.deferReply().catch(() => { });

      const _command: BaseCommand = client.collections.commands.get(
        interaction.commandName
      ) as BaseCommand;
      if (process.env.Debug === "True") console.log(_command);

      const args = [];
      //interaction.options.data.array().map((x) => args.push(x.value));

      const tools = client.Tools;

      await _command.SlashRun(client, interaction, args, tools);
      // .then((response) => {
      //   interaction.reply(response);
      // });
    }

    if (interaction.isButton()) {
      interaction.deferUpdate()
    }

    if (interaction.isSelectMenu()) {
      interaction.deferUpdate()
    }
  }
};
