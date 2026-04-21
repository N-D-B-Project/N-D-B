import { localizationMapByKey } from "@necord/localization";
import { ChannelType, type GuildTextBasedChannel } from "discord.js";
import { ChannelOption } from "necord";

export class ListReactionsDTO {
	@ChannelOption({
		name: "channel",
		description: "Filter by a specific channel (optional)",
		name_localizations: localizationMapByKey(
			"ReactionRoles.list.options.channel.name",
		),
		description_localizations: localizationMapByKey(
			"ReactionRoles.list.options.channel.description",
		),
		channel_types: [ChannelType.GuildText],
		required: false,
	})
	public readonly channel?: GuildTextBasedChannel;
}
