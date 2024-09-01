import { localizationMapByKey } from "@necord/localization";
import { StringOption } from "necord";

export class EvalDTO {
	@StringOption({
		name: "code",
		description: "Code to begin evaluated",
		name_localizations: localizationMapByKey(
			"DeveloperTools.eval.options.code.name",
		),
		description_localizations: localizationMapByKey(
			"DeveloperTools.eval.options.code.description",
		),
		required: true,
		autocomplete: false,
	})
	public readonly code: string;
}
