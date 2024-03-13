import { LocalizationMap } from "discord-api-types/v10";

export interface Localization {
	name: LocalizationMap;
	description: LocalizationMap;
	options?: {
		[key: string]: Localization;
	};
}
