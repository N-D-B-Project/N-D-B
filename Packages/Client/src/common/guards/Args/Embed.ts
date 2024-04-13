import { Context } from "@/modules/bot/commands/Commands.context";
import { LegacyCommandOptions } from "@/modules/bot/commands/types";
import { NestedLocalizationAdapter } from "@necord/localization";
import { Client, EmbedBuilder } from "discord.js";

export async function embed(
	client: Client,
	translate: NestedLocalizationAdapter,
	type: "TooManyArgs" | "NoMinArgs",
	context: Context,
	commandOptions: LegacyCommandOptions,
): Promise<EmbedBuilder> {
	return new EmbedBuilder()
		.setAuthor({
			name: context.author.tag,
			iconURL: context.author.displayAvatarURL(),
		})
		.setTitle(translate.getTranslation(`Tools/Command:Checker:${type}:Title`, context.interaction.guildLocale))
		.setColor("#c20e00")
		.setDescription(
			translate.getTranslation("Tools/Command:Checker:NoMinArgs:Description", context.interaction.guildLocale),
		)
		.addFields([
			{
				name: translate.getTranslation("Tools/Command:Checker:NoMinArgs:Fields:1", context.interaction.guildLocale),
				value: translate.getTranslation(
					"Tools/Command:Checker:NoMinArgs:Fields:Content:1",
					context.interaction.guildLocale,
					{
						Args: String(commandOptions.args.min),
					},
				),
			},
			{
				name: translate.getTranslation("Tools/Command:Checker:NoMinArgs:Fields:2", context.interaction.guildLocale),
				value: translate.getTranslation(
					"Tools/Command:Checker:NoMinArgs:Fields:Content:2",
					context.interaction.guildLocale,
					{
						Usage: `${context.prefix}${commandOptions.name} ${commandOptions.usage}`,
					},
				),
			},
		])
		.setFooter({
			text: client.user.tag,
			iconURL: client.user.displayAvatarURL(),
		});
}
