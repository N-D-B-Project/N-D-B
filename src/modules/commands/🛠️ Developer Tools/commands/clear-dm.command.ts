import { CommandConfig, CommandPermissions } from "@/common/decorators/";
import { Logger } from "@nestjs/common";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../DeveloperTools.decorator";

@DeveloperToolsCommand()
export class ClearDMCommand {
	@Subcommand({
		name: "clear_dm",
		description: "clear bot's dm",
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
		const channel = interaction.user.dmChannel;
		const messages = await channel.messages.fetch({
			limit: 100,
		});
		for await (const message of messages.values()) {
			if (message.deletable && message.author.bot) {
				await message.delete();
			}
		}
	}
}
