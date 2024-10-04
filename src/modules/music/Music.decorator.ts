import { localizationMapByKey } from "@necord/localization";
import { createCommandGroupDecorator } from "necord";

export const MusicCommand = createCommandGroupDecorator({
	name: "music",
	description: "Category 🎵 Music",
	nameLocalizations: localizationMapByKey("Music.category.name"),
	descriptionLocalizations: localizationMapByKey("Music.category.description"),
	dmPermission: false,
});
