import { localizationMapByKey } from "@necord/localization";
import { Injectable } from "@nestjs/common";
import { StringOption } from "necord";

@Injectable()
export class CreateTicketTypeDTO {
	@StringOption({
		name: "name",
		name_localizations: localizationMapByKey("Tickets.type.options.name.name"),
		description: "The name of Ticket Type",
		description_localizations: localizationMapByKey("Tickets.type.options.name.description"),
		autocomplete: false,
		required: true,
		min_length: 4,
		max_length: 25,
	})
	public readonly name: string;

	@StringOption({
		name: "description",
		name_localizations: localizationMapByKey("Tickets.type.options.description.name"),
		description: "The description of Ticket Type",
		description_localizations: localizationMapByKey("Tickets.type.options.description.name"),
		autocomplete: false,
		required: true,
		min_length: 10,
		max_length: 256,
	})
	public readonly description: string;

	@StringOption({
		name: "message",
		name_localizations: localizationMapByKey("Tickets.type.options.message.name"),
		description: "The message that will be send when a ticket is opened",
		description_localizations: localizationMapByKey("Tickets.type.options.message.description"),
		autocomplete: false,
		required: true,
	})
	public readonly message: string;

	@StringOption({
		name: "emoji",
		name_localizations: localizationMapByKey("Tickets.type.options.emoji.name"),
		description: "The emoji of ticket type",
		description_localizations: localizationMapByKey("Tickets.type.options.emoji.description"),
		autocomplete: false,
		required: true,
	})
	public readonly emoji: string;
}
