import { CommandConfig, CommandPermissions } from "@/common/decorators/";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { CurrentTranslate, TranslationFn, localizationMapByKey } from "@necord/localization";
import { Logger, UseGuards } from "@nestjs/common";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../DeveloperTools.decorator";

@DeveloperToolsCommand()
export class TestCommand {
	private readonly logger = new Logger(TestCommand.name);

	@Subcommand({
		name: "test",
		description: "Command for Testing things",
		nameLocalizations: localizationMapByKey("DeveloperTools.test.name"),
		descriptionLocalizations: localizationMapByKey("DeveloperTools.test.description"),
	})
	@CommandConfig({ category: "🛠️ Developer Tools", disable: false })
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		ownerOnly: true,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext, @CurrentTranslate() t: TranslationFn) {
		interaction.reply(t("DeveloperTools.test.message"));
	}
}
