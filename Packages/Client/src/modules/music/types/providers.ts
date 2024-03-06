import { MusicEmbeds } from "../Music.embeds";
import { MusicManager } from "../Music.manager";
import { MusicService } from "../Music.service";
import { Music } from "./constants";

export const MusicManagerProvider = {
	provide: Music.Manager,
	useClass: MusicManager,
};

export const MusicEmbedsProvider = {
	provide: Music.Embeds,
	useClass: MusicEmbeds,
};

export const MusicServiceProvider = {
	provide: Music.Service,
	useClass: MusicService,
};
