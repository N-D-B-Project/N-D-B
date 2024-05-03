import { localizationMapByKey } from "@necord/localization";
import { createCommandGroupDecorator } from "necord";

export const ModerationCommand = createCommandGroupDecorator({
	name: "moderation",
	description: "Category 🛡️ Moderation",
	nameLocalizations: localizationMapByKey("Moderation.category.name"),
	descriptionLocalizations: localizationMapByKey("Moderation.category.description"),
});
