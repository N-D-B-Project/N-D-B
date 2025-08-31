import type { Provider } from "@nestjs/common";
import { MusicEmbeds } from "../Music.embeds";
import { PlayerSaver } from "./../utils/PlayerSaver";
import { Music } from "./constants";

export const MusicEmbedsProvider: Provider<MusicEmbeds> = {
	provide: Music.Embeds,
	useClass: MusicEmbeds,
};

export const PlayerSaverProvider: Provider<PlayerSaver> = {
	provide: Music.PlayerSaver,
	useClass: PlayerSaver,
};
