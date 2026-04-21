import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators/";
import { DeveloperToolsCommand } from "../DeveloperTools.decorator";

@DeveloperToolsCommand()
export class HelloCommand {
	@Subcommand({
		name: "hello_world",
		description: "a simple hello",
	})
	@CommandConfig({ category: "🛠️ Developer Tools", disable: false })
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		testOnly: false,
		ownerOnly: true,
	})
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext) {
		interaction.reply("Hello, World!");
	}
}
