import type { Provider } from "@nestjs/common";
import { MusicEmbeds } from "../Music.embeds";
import { Music } from "./constants";

export const MusicEmbedsProvider: Provider<MusicEmbeds> = {
	provide: Music.Embeds,
	useClass: MusicEmbeds,
};
