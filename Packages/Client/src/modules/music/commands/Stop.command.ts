import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Music } from "../";
import { CommandContext } from "../../commands/Commands.context";
import { IMusicService } from "../interfaces";

@Injectable()
export class StopCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
	) {}

	private readonly logger = new Logger(StopCommand.name);

	@LegacyCommand({
		name: "stop",
		aliases: ["Stop"],
		description: "Stops the music queue",
		usage: "",
	})
	@SlashCommand({
		name: "stop",
		type: "Sub",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["SendMessages"],
		user: ["SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext) {
		const player = await this.service.getPlayer(context);
		if (!(await this.service.checkers(context))) return;
		await player.destroy();
		return context.reply(await this.Translate.Guild(context, "Tools/Music:Stop"));
	}
}
