import { CommandConfig, CommandPermissions } from "@/common/decorators/";
import { CurrentTranslate, type TranslationFn } from "@necord/localization";
import { Logger } from "@nestjs/common";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../DeveloperTools.decorator";

@DeveloperToolsCommand()
export class HelloCommand {
	private readonly logger = new Logger(HelloCommand.name);

	@Subcommand({
		name: "hello_world",
		description: "a simple hello",
	})
	@CommandConfig({ category: "🛠️ Developer Tools", disable: true })
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		testOnly: false,
		ownerOnly: true,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		interaction.reply("Hello, World!");
	}
}
