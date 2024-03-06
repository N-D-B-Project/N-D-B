import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators/";
import { EnableGuard } from "@/common/guards/Enable.guard";
import { OwnerPermissionGuard } from "@/common/guards/Permissions/Owner.Guard";
import { Extends, Services } from "@/types/Constants";
import { INDBService, Ii18nService } from "@/types/Interfaces";
import { Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { CommandContext } from "../Commands.context";

@Injectable()
export class TestCommand {
	public constructor(
		@Inject(Services.NDB) private readonly NDBService: INDBService,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
	) {}

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
	public async onCommandRun([client, context]: CommandContext) {
		const embeds: EmbedBuilder[] = [];
		for (let i = 0; i < 5; i++) {
			embeds.push(new EmbedBuilder().setDescription(`Desc ${i + 1}`));
		}

		await context.reply(await this.NDBService.buildPaginator(context, embeds, "test_command"));
	}
}
