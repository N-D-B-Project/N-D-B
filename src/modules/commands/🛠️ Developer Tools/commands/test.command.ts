import { CommandConfig, CommandPermissions } from "@/common/decorators/";
import {
	CurrentTranslate,
	type TranslationFn,
	localizationMapByKey,
} from "@necord/localization";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../DeveloperTools.decorator";

@DeveloperToolsCommand()
export class TestCommand {
	@Subcommand({
		name: "test",
		description: "Command for Testing things",
		nameLocalizations: localizationMapByKey("DeveloperTools.test.name"),
		descriptionLocalizations: localizationMapByKey(
			"DeveloperTools.test.description",
		),
	})
	@CommandConfig({ category: "🛠️ Developer Tools", disable: false })
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		testOnly: true,
		ownerOnly: true,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		interaction.reply(t("DeveloperTools.test.message"));
	}
}
