import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { channelMention } from "discord.js";
import { Ctx, Options, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "#src/common/decorators/index.js";
import { WAIT } from "#src/utils/Tools.js";
import { ModerationCommand } from "../../Moderation.decorator.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with validation system>
import { ClearDTO } from "./clear.dto.js";

@ModerationCommand()
export class ClearCommand {
	@Subcommand({
		name: "clear",
		description: "Clear a number of messages in the selected channel",
		nameLocalizations: localizationMapByKey("Moderation.clear.name"),
		descriptionLocalizations: localizationMapByKey(
			"Moderation.clear.description",
		),
	})
	@CommandConfig({ category: "🛡️ Moderation", disable: false })
	@CommandPermissions({
		bot: [],
		user: ["ManageMessages"],
		guildOnly: false,
		testOnly: true,
		ownerOnly: false,
	})
	public async OnCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@Options() { amount, channel }: ClearDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		if (!channel) {
			channel = interaction.channel;
		}
		const fetched = await channel.messages.fetch({
			limit: amount,
		});
		try {
			channel.bulkDelete(fetched);
			const res = await interaction.reply({
				content: t("Moderation.clear.response.success", {
					amount,
					channel: channelMention(channel.id),
				}),
			});
			await WAIT(4000);
			res.delete();
		} catch (_error) {
			interaction.reply({
				content: t("Moderation.clear.response.error"),
				flags: "Ephemeral",
			});
		}
	}
}
