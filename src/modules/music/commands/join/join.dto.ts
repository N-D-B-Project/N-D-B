import { localizationMapByKey } from "@necord/localization";
import { ChannelType, type VoiceChannel } from "discord.js";
import { ChannelOption } from "necord";

export class JoinDto {
	@ChannelOption({
		name: "channel",
		name_localizations: localizationMapByKey("Music.join.options.channel.name"),
		description: "Voice Channel to Join",
		description_localizations: localizationMapByKey(
			"Music.join.options.channel.description",
		),
		channel_types: [ChannelType.GuildVoice, ChannelType.GuildStageVoice],
		required: false,
	})
	public readonly channel?: VoiceChannel;
}
