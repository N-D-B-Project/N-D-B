import { Provider } from "@nestjs/common";
import { MusicEmbeds } from "../Music.embeds";
import { MusicManager } from "../Music.manager";
import { MusicService } from "../Music.service";
import { Music } from "./constants";

export const MusicManagerProvider: Provider<MusicManager> = {
	provide: Music.Manager,
	useClass: MusicManager,
};

export const MusicEmbedsProvider: Provider<MusicEmbeds> = {
	provide: Music.Embeds,
	useClass: MusicEmbeds,
};

export const MusicServiceProvider: Provider<MusicService> = {
	provide: Music.Service,
	useClass: MusicService,
};
