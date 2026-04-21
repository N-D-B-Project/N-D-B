import { localizationMapByKey } from "@necord/localization";
import { ChannelType, type CategoryChannel, type Role } from "discord.js";
import { ChannelOption, RoleOption, StringOption } from "necord";

export class ConfigureTicketTypeDTO {
	@StringOption({
		name: "name",
		name_localizations: localizationMapByKey(
			"Tickets.configure_type.options.name.name",
		),
		description: "The name of the ticket type to configure",
		description_localizations: localizationMapByKey(
			"Tickets.configure_type.options.name.description",
		),
		autocomplete: true,
		required: true,
	})
	public readonly name!: string;

	@RoleOption({
		name: "support_role",
		name_localizations: localizationMapByKey(
			"Tickets.configure_type.options.support_role.name",
		),
		description: "The role that can access tickets of this type",
		description_localizations: localizationMapByKey(
			"Tickets.configure_type.options.support_role.description",
		),
		required: false,
	})
	public readonly support_role?: Role;

	@ChannelOption({
		name: "category",
		name_localizations: localizationMapByKey(
			"Tickets.configure_type.options.category.name",
		),
		description: "The category where ticket channels will be created",
		description_localizations: localizationMapByKey(
			"Tickets.configure_type.options.category.description",
		),
		required: false,
		channel_types: [ChannelType.GuildCategory],
	})
	public readonly category?: CategoryChannel;

	@StringOption({
		name: "description",
		name_localizations: localizationMapByKey(
			"Tickets.configure_type.options.description.name",
		),
		description: "New description for the ticket type",
		description_localizations: localizationMapByKey(
			"Tickets.configure_type.options.description.description",
		),
		required: false,
		min_length: 10,
		max_length: 256,
	})
	public readonly description?: string;

	@StringOption({
		name: "message",
		name_localizations: localizationMapByKey(
			"Tickets.configure_type.options.message.name",
		),
		description: "New message sent when a ticket is opened",
		description_localizations: localizationMapByKey(
			"Tickets.configure_type.options.message.description",
		),
		required: false,
	})
	public readonly message?: string;

	@StringOption({
		name: "emoji",
		name_localizations: localizationMapByKey(
			"Tickets.configure_type.options.emoji.name",
		),
		description: "New emoji for the ticket type",
		description_localizations: localizationMapByKey(
			"Tickets.configure_type.options.emoji.description",
		),
		required: false,
	})
	public readonly emoji?: string;
}
