import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { ReactionRolesCommand } from "../ReactionRoles.decorator";

@ReactionRolesCommand()
export class ReactionTypesCommand {
	@Subcommand({
		name: "types",
		description: "Show the types of ReactionRoles",
		nameLocalizations: localizationMapByKey("ReactionRoles.types.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.types.description",
		),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages"],
		bot: ["EmbedLinks"],
		guildOnly: false,
		testOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const embed = new EmbedBuilder()
			.setTitle(t("ReactionRoles.types.EmbedTitle"))
			.setDescription(t("ReactionRoles.types.Types"))
			.setColor(0x5865f2);

		return interaction.reply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	}
}
