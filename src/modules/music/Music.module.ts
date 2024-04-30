import { Global, Module } from "@nestjs/common";
import { MusicEmbedsProvider, MusicManagerProvider, MusicServiceProvider } from ".";
import { NDBServiceProvider } from "../core/provider/NDBService.provider";
import * as Commands from "./commands";
import * as Events from "./events";

@Global()
@Module({
	imports: [],
	providers: [
		...Object.values(Events),
		...Object.values(Commands),
		MusicManagerProvider,
		MusicEmbedsProvider,
		MusicServiceProvider,
		NDBServiceProvider,
	],
	exports: [MusicManagerProvider, MusicEmbedsProvider, MusicServiceProvider],
})
export class MusicModule {}
