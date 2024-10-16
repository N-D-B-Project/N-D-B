import { localizationMapByKey } from "@necord/localization";
import type { SearchPlatform } from "lavalink-client";
import { StringOption } from "necord";

export class PlayDto {
	@StringOption({
		name: "query",
		name_localizations: localizationMapByKey("Music.play.options.query.name"),
		description: "<URL or Name> of the requested Track or Playlist",
		description_localizations: localizationMapByKey(
			"Music.play.options.query.description",
		),
		required: true,
	})
	public readonly query!: string;

	@StringOption({
		name: "source",
		name_localizations: localizationMapByKey("Music.play.options.source.name"),
		description:
			"Source where the bot will be search for the Track or Playlist (default: Youtube)",
		description_localizations: localizationMapByKey(
			"Music.play.options.source.description",
		),
		autocomplete: true,
		required: false,
	})
	public readonly source?: SearchPlatform;
}
