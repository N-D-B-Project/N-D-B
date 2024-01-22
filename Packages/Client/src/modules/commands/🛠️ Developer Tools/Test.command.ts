import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators/";
import { EnableGuard } from "@/common/guards/Enable.guard";
import { OwnerPermissionGuard } from "@/common/guards/Permissions/Owner.Guard";
import { Injectable, Logger, UseGuards } from "@nestjs/common";
import { CommandContext } from "../Commands.context";

@Injectable()
export class TestCommand {
	private readonly logger = new Logger(TestCommand.name);

	@LegacyCommand({
		name: "test",
		description: "",
		usage: "",
	})
	@SlashCommand({
		type: "Sub",
		deployMode: "Test",
		name: "test",
	})
	@CommandConfig({ category: "🛠️ Developer Tools" })
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		ownerOnly: true,
	})
	@UseGuards(EnableGuard, OwnerPermissionGuard)
	public async onCommandRun([client, context]: CommandContext) {}
}
