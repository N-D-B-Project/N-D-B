import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";

export class PlayDTO {
	@StringOption({
		name: "query",
		description: "<URL or Name> of the Music or Playlist",
		name_localizations: localizationMapByKey("Music.play.options.query.name"),
		description_localizations: localizationMapByKey("Music.play.options.query.description"),
		required: true,
		autocomplete: false,
	})
	public readonly query: string;
}
