import type { Provider } from "@nestjs/common";
import { MusicEmbeds } from "../Music.embeds.js";
import { Music } from "./constants.js";

export const MusicEmbedsProvider: Provider<MusicEmbeds> = {
	provide: Music.Embeds,
	useClass: MusicEmbeds,
};
