import { DeveloperToolsLocalization as Localization } from "@/common/Languages/Localization/DeveloperTools";
import { Injectable, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../../common/decorators/Commands.decorator";
import { OwnerPermissionGuard } from "../../../common/guards/Permissions/Owner.Guard";
import { CommandContext } from "../Commands.context";
import { RunSubCommandEvent } from "../Commands.discovery";

@UseGuards(OwnerPermissionGuard)
@Injectable()
export class DeveloperToolsMainSlashCommand {
  public constructor(private readonly eventEmitter: EventEmitter2) {}

  @Command({
    category: "🛠️ Developer Tools",
    permissions: {
      user: [],
      bot: [],
      guildOnly: false,
      ownerOnly: true
    },
    slash: {
      data: new SlashCommandBuilder()
        .setName("developer_tools")
        .setNameLocalizations(Localization.name)
        .setDescription("Category 🛠️ Developer Tools")
        .setDescriptionLocalizations(Localization.description)
        .addSubcommand(command =>
          command
            .setName("eval")
            .setNameLocalizations(Localization.options.eval.name)
            .setDescription(
              "Evaluate some codes to test it without restart the bot every time"
            )
            .setDescriptionLocalizations(Localization.options.eval.description)
            .addStringOption(option =>
              option
                .setName("code")
                .setNameLocalizations(
                  Localization.options.eval.options.code.name
                )
                .setDescription("Code to begin evaluated")
                .setDescriptionLocalizations(
                  Localization.options.eval.options.code.description
                )
            )
        )
        .addSubcommand(command =>
          command
            .setName("test")
            .setNameLocalizations(Localization.options.test.name)
            .setDescription("Command for Testing things")
            .setDescriptionLocalizations(Localization.options.test.description)
        ),
      type: "Main",
      deployMode: "Test"
    }
  })
  public async onCommandRun([client, context]: CommandContext) {
    const Payload = new RunSubCommandEvent();
    Payload.SubList = [{ name: "eval" }, { name: "test" }];
    Payload.context = context;
    Payload.Additional = "Sub";
    this.eventEmitter.emit("commands.sub", Payload);
  }
}
