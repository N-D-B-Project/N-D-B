import { localizationMapByKey } from "@necord/localization";
import { ChannelType, type GuildTextBasedChannel } from "discord.js";
import { ChannelOption, NumberOption } from "necord";

export class ClearDTO {
	@NumberOption({
		name: "amount",
		description: "Amount of messages that will be deletes (1-100)",
		name_localizations: localizationMapByKey(
			"Moderation.clear.options.amount.name",
		),
		description_localizations: localizationMapByKey(
			"Moderation.clear.options.amount.description",
		),
		min_value: 1,
		max_value: 100,
		autocomplete: false,
		required: true,
	})
	public readonly amount: number;

	@ChannelOption({
		name: "channel",
		description: "Channel where the messages will be deleted",
		name_localizations: localizationMapByKey(
			"Moderation.clear.options.channel.name",
		),
		description_localizations: localizationMapByKey(
			"Moderation.clear.options.channel.description",
		),
		channel_types: [ChannelType.GuildText],
		required: false,
	})
	public readonly channel?: GuildTextBasedChannel;
}
