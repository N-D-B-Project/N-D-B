import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";

export class DeleteTicketTypeDTO {
	@StringOption({
		name: "name",
		name_localizations: localizationMapByKey("Tickets.delete_type.options.name.name"),
		description: "The name of the ticket type to delete",
		description_localizations: localizationMapByKey(
			"Tickets.delete_type.options.name.description",
		),
		autocomplete: true,
		required: true,
	})
	public readonly name!: string;
}
