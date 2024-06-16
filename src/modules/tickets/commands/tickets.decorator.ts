import { localizationMapByKey } from "@necord/localization";
import { createCommandGroupDecorator } from "necord";

export const TicketCommand = createCommandGroupDecorator({
	name: "tickets",
	description: "Category 🎫 Tickets",
	// nameLocalizations: localizationMapByKey("Tickets.category.name"),
	// descriptionLocalizations: localizationMapByKey("Tickets.category.description"),
	dmPermission: false,
});
