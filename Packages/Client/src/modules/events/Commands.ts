import { Extends } from "@/types/Constants";
import { ICommandsService } from "@/types/Interfaces";
import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message
} from "discord.js";
import { Context } from "../commands/Commands.context";
import { RunSubCommandEvent } from "../commands/Commands.discovery";

@Injectable()
export class CommandsEvents {
  public constructor(
    @Inject(Extends.Command) private readonly commandsService: ICommandsService,
    private readonly client: Client
  ) {}

  @OnEvent("commands.legacy", { async: true })
  public async onGuildCommand(message: Message, prefix: string) {
    await this.Runner(message, prefix, "None");
  }

  @OnEvent("commands.dm")
  public async onDMCommand(message: Message, prefix: string) {
    await this.Runner(message, prefix, "DM");
  }

  @OnEvent("commands.slash")
  public async onInteractionCommand(interaction: CommandInteraction) {
    const context = new Context(
      interaction,
      interaction.options as CommandInteractionOptionResolver,
      "None"
    );
    const _Command = await this.commandsService.get(
      interaction.commandName,
      context
    );
    if (_Command) {
      await interaction.deferReply().catch(e => {});
      _Command.execute([this.client, context]);
    }
  }

  @OnEvent("commands.sub")
  public async onSubCommand({
    context,
    SubList,
    Additional
  }: RunSubCommandEvent) {
    const args = await context.getInteractionArgs();
    for (const { name } of SubList) {
      if (args.getSubcommand() === name) {
        const newContext = new Context(
          context.interaction,
          args.data[0].options,
          Additional
        );
        const _SubCommand = await this.commandsService.get(name, newContext);
        if (_SubCommand) {
          _SubCommand.execute([this.client, newContext]);
        }
      }
    }
  }

  private async Runner(message: Message, prefix: string, type: "None" | "DM") {
    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const context = new Context(message, args as Array<string>, type, prefix);
    const _Command = await this.commandsService.get(cmd, context);
    if (_Command) {
      _Command.execute([this.client, context]);
    }
  }
}
