import { localizationMapByKey } from "@necord/localization";
import { createCommandGroupDecorator } from "necord";

export const DeveloperToolsCommand = createCommandGroupDecorator({
	name: "developer_tools",
	description: "Category 🛠️ Developer Tools",
	nameLocalizations: localizationMapByKey("DeveloperTools.category.name"),
	descriptionLocalizations: localizationMapByKey("DeveloperTools.category.description"),
});
