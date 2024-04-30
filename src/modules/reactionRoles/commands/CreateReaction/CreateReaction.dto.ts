import { localizationMapByKey } from "@necord/localization";
import { ChannelType, GuildTextBasedChannel, Role } from "discord.js";
import { ChannelOption, NumberOption, RoleOption, StringOption } from "necord";

export class CreateReactionDTO {
	@ChannelOption({
		name: "channel",
		description: "Channel where the ReactionRole will be created",
		name_localizations: localizationMapByKey("ReactionRoles.create.options.channel.name"),
		description_localizations: localizationMapByKey("ReactionRoles.create.options.channel.description"),
		channel_types: [ChannelType.GuildText],
		required: true,
	})
	public readonly channel: GuildTextBasedChannel;

	@StringOption({
		name: "message",
		description: "Message ID that the member will react",
		name_localizations: localizationMapByKey("ReactionRoles.create.options.message.name"),
		description_localizations: localizationMapByKey("ReactionRoles.create.options.message.description"),
		required: true,
	})
	public readonly messageId: string;

	@RoleOption({
		name: "role",
		description: "Role to be used in ReactionRole",
		name_localizations: localizationMapByKey("ReactionRoles.create.options.role.name"),
		description_localizations: localizationMapByKey("ReactionRoles.create.options.role.description"),
		required: true,
	})
	public readonly role: Role;

	@StringOption({
		name: "emoji",
		description: "Emoji that the user will react",
		name_localizations: localizationMapByKey("ReactionRoles.create.options.emoji.name"),
		description_localizations: localizationMapByKey("ReactionRoles.create.options.emoji.description"),
		required: true,
	})
	public readonly emoji: string;

	@NumberOption({
		name: "type",
		description: "Type of ReactionRole (1-6) (/reaction_role types)",
		name_localizations: localizationMapByKey("ReactionRoles.create.options.type.name"),
		description_localizations: localizationMapByKey("ReactionRoles.create.options.type.description"),
		required: false,
	})
	public readonly option: number;
}
