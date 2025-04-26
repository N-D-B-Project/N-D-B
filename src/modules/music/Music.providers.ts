import { Embeds } from "@/types";
import type { Provider } from "@nestjs/common";
import { MusicEmbeds } from "./Music.embeds";

export const MusicEmbedsProvider: Provider<MusicEmbeds> = {
	provide: Embeds.Music,
	useClass: MusicEmbeds,
};
