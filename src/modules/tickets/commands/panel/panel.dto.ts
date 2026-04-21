import { localizationMapByKey } from "@necord/localization";
import { type CategoryChannel, ChannelType, type Role } from "discord.js";
import { ChannelOption, RoleOption, StringOption } from "necord";

export class PanelDTO {
	@StringOption({
		name: "title",
		name_localizations: localizationMapByKey("Tickets.panel.options.title.name"),
		description: "Custom title for the ticket panel",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.title.description",
		),
		required: false,
		max_length: 256,
	})
	public readonly title?: string;

	@StringOption({
		name: "description",
		name_localizations: localizationMapByKey(
			"Tickets.panel.options.description.name",
		),
		description: "Custom description for the ticket panel",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.description.description",
		),
		required: false,
		max_length: 4096,
	})
	public readonly description?: string;

	@StringOption({
		name: "color",
		name_localizations: localizationMapByKey("Tickets.panel.options.color.name"),
		description: "Hex color for the panel embed (e.g. #5865F2)",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.color.description",
		),
		required: false,
		min_length: 7,
		max_length: 7,
	})
	public readonly color?: string;

	@StringOption({
		name: "thumbnail",
		name_localizations: localizationMapByKey("Tickets.panel.options.thumbnail.name"),
		description: "Thumbnail image URL for the panel embed",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.thumbnail.description",
		),
		required: false,
	})
	public readonly thumbnail?: string;

	@StringOption({
		name: "image",
		name_localizations: localizationMapByKey("Tickets.panel.options.image.name"),
		description: "Large image URL for the panel embed",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.image.description",
		),
		required: false,
	})
	public readonly image?: string;

	@StringOption({
		name: "footer",
		name_localizations: localizationMapByKey("Tickets.panel.options.footer.name"),
		description: "Footer text for the panel embed",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.footer.description",
		),
		required: false,
		max_length: 2048,
	})
	public readonly footer?: string;

	@StringOption({
		name: "button_label",
		name_localizations: localizationMapByKey("Tickets.panel.options.button_label.name"),
		description: "Custom label for the open ticket button",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.button_label.description",
		),
		required: false,
		max_length: 80,
	})
	public readonly button_label?: string;

	@StringOption({
		name: "button_emoji",
		name_localizations: localizationMapByKey("Tickets.panel.options.button_emoji.name"),
		description: "Custom emoji for the open ticket button",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.button_emoji.description",
		),
		required: false,
	})
	public readonly button_emoji?: string;

	@RoleOption({
		name: "default_role",
		name_localizations: localizationMapByKey("Tickets.panel.options.default_role.name"),
		description: "Default support role for all ticket types",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.default_role.description",
		),
		required: false,
	})
	public readonly default_role?: Role;

	@ChannelOption({
		name: "default_category",
		name_localizations: localizationMapByKey("Tickets.panel.options.default_category.name"),
		description: "Default category for all ticket channels",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.default_category.description",
		),
		required: false,
		channel_types: [ChannelType.GuildCategory],
	})
	public readonly default_category?: CategoryChannel;

	@StringOption({
		name: "default_message",
		name_localizations: localizationMapByKey("Tickets.panel.options.default_message.name"),
		description: "Default message shown when a ticket is opened",
		description_localizations: localizationMapByKey(
			"Tickets.panel.options.default_message.description",
		),
		required: false,
		max_length: 4096,
	})
	public readonly default_message?: string;
}
