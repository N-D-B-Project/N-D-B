import { CommandConfig, CommandPermissions } from "@/common/decorators/";
import { Logger } from "@nestjs/common";
import { ApplicationIntegrationType, InteractionContextType } from "discord.js";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../DeveloperTools.decorator";

@DeveloperToolsCommand()
export class HelloCommand {
	private readonly logger = new Logger(HelloCommand.name);

	@Subcommand({
		name: "hello_world",
		description: "a simple hello",
		contexts: [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel,
		],
		integrationTypes: [
			ApplicationIntegrationType.GuildInstall,
			ApplicationIntegrationType.UserInstall,
		],
	})
	@CommandConfig({ category: "🛠️ Developer Tools", disable: false })
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		testOnly: true,
		ownerOnly: true,
	})
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext) {
		interaction.reply("Hello, World!");
	}
}
