import { localizationMapByKey } from "@necord/localization";
import { ChannelType, type GuildTextBasedChannel, type Role } from "discord.js";
import { ChannelOption, NumberOption, RoleOption, StringOption } from "necord";

export class EditReactionDTO {
	@ChannelOption({
		name: "channel",
		description: "Channel where the ReactionRole is located",
		name_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.channel.name",
		),
		description_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.channel.description",
		),
		channel_types: [ChannelType.GuildText],
		required: true,
	})
	public readonly channel: GuildTextBasedChannel;

	@StringOption({
		name: "message",
		description: "Message ID used in ReactionRole",
		name_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.message.name",
		),
		description_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.message.description",
		),
		required: true,
	})
	public readonly messageId: string;

	@RoleOption({
		name: "role",
		description: "Role used in ReactionRole",
		name_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.role.name",
		),
		description_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.role.description",
		),
		required: true,
	})
	public readonly role: Role;

	@StringOption({
		name: "emoji",
		description: "Emoji used in ReactionRole",
		name_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.emoji.name",
		),
		description_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.emoji.description",
		),
		required: true,
	})
	public readonly emoji: string;

	@NumberOption({
		name: "new_type",
		description: "New type of ReactionRole (1-6) (/reaction_roles types)",
		name_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.new_type.name",
		),
		description_localizations: localizationMapByKey(
			"ReactionRoles.edit.options.new_type.description",
		),
		required: true,
		min_value: 1,
		max_value: 6,
	})
	public readonly newOption: number;
}
