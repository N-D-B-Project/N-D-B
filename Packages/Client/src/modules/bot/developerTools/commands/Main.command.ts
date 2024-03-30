import { DeveloperToolsLocalization as Localization } from "@/common/Languages/Localization/DeveloperTools";
import { CommandConfig, CommandPermissions, SlashCommand } from "@/common/decorators";
import { OwnerPermissionGuard } from "@/common/guards/Permissions/Owner.Guard";
import { Injectable, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SlashCommandBuilder } from "discord.js";
import { CommandContext } from "../../commands/Commands.context";
import { RunSubCommandEvent } from "../../commands/Commands.discovery";

@UseGuards(OwnerPermissionGuard)
@Injectable()
export class DeveloperToolsMainSlashCommand {
	public constructor(private readonly eventEmitter: EventEmitter2) {}

	@SlashCommand({
		data: new SlashCommandBuilder()
			.setName("developer_tools")
			.setNameLocalizations(Localization.name)
			.setDescription("Category 🛠️ Developer Tools")
			.setDescriptionLocalizations(Localization.description)
			.addSubcommand((command) =>
				command
					.setName("eval")
					.setNameLocalizations(Localization.options.eval.name)
					.setDescription("Evaluate some codes to test it without restart the bot every time")
					.setDescriptionLocalizations(Localization.options.eval.description)
					.addStringOption((option) =>
						option
							.setName("code")
							.setNameLocalizations(Localization.options.eval.options.code.name)
							.setDescription("Code to begin evaluated")
							.setDescriptionLocalizations(Localization.options.eval.options.code.description),
					),
			)
			.addSubcommand((command) =>
				command
					.setName("test")
					.setNameLocalizations(Localization.options.test.name)
					.setDescription("Command for Testing things")
					.setDescriptionLocalizations(Localization.options.test.description),
			),
		type: "Main",
		deployMode: "Test",
	})
	@CommandConfig({
		category: "🛠️ Developer Tools",
	})
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		ownerOnly: true,
	})
	public async onCommandRun([client, context]: CommandContext) {
		const Payload = new RunSubCommandEvent()
			.setAdditional("Sub")
			.setContext(context)
			.setSubList([{ name: "eval" }, { name: "test" }]);
		this.eventEmitter.emit("commands.sub", Payload);
	}
}
