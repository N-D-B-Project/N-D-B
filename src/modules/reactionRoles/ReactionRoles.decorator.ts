import { localizationMapByKey } from "@necord/localization";
import { createCommandGroupDecorator } from "necord";

export const ReactionRolesCommand = createCommandGroupDecorator({
	name: "reaction_roles",
	description: "Category 🎩 ReactionRoles",
	nameLocalizations: localizationMapByKey("ReactionRoles.category.name"),
	descriptionLocalizations: localizationMapByKey("ReactionRoles.category.description"),
	dmPermission: false,
  guilds: ["717094267243462688"]
});
