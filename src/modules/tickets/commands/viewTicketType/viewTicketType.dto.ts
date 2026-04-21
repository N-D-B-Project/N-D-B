import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";

export class ViewTicketTypeDTO {
	@StringOption({
		name: "name",
		name_localizations: localizationMapByKey("Tickets.view_type.options.name.name"),
		description: "The name of the ticket type to view",
		description_localizations: localizationMapByKey(
			"Tickets.view_type.options.name.description",
		),
		autocomplete: true,
		required: true,
	})
	public readonly name!: string;
}
