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

	@StringOption({
		name: "source",
		description: "Source where the bot will be search for the music - Default: Youtube",
		name_localizations: localizationMapByKey("Music.play.options.source.name"),
		description_localizations: localizationMapByKey("Music.play.options.source.description"),
		required: false,
		autocomplete: true,
	})
	public readonly source: string;
}
