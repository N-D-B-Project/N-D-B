import { LegacyCommandOptions } from "@/modules/commands/types";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Client, EmbedBuilder } from "discord.js";
import { Context } from "../../../modules/commands/Commands.context";

export async function embed(
	client: Client,
	Translate: Ii18nService,
	type: "TooManyArgs" | "NoMinArgs",
	context: Context,
	commandOptions: LegacyCommandOptions,
): Promise<EmbedBuilder> {
	return new EmbedBuilder()
		.setAuthor({
			name: context.author.tag,
			iconURL: context.author.displayAvatarURL(),
		})
		.setTitle(await Translate.TFunction(context, `Tools/Command:Checker:${type}:Title`))
		.setColor("#c20e00")
		.setDescription(await Translate.TFunction(context, "Tools/Command:Checker:NoMinArgs:Description"))
		.addFields([
			{
				name: await Translate.TFunction(context, "Tools/Command:Checker:NoMinArgs:Fields:1"),
				value: await Translate.TFunction(context, "Tools/Command:Checker:NoMinArgs:Fields:Content:1", {
					Args: commandOptions.args.min,
				}),
			},
			{
				name: await Translate.TFunction(context, "Tools/Command:Checker:NoMinArgs:Fields:2"),
				value: await Translate.TFunction(context, "Tools/Command:Checker:NoMinArgs:Fields:Content:2", {
					Usage: `${context.prefix}${commandOptions.name} ${commandOptions.usage}`,
				}),
			},
		])
		.setFooter({
			text: client.user.tag,
			iconURL: client.user.displayAvatarURL(),
		});
}
