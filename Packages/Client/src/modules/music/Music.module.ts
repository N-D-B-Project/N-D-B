import { DatabaseProvider, TranslateProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";
import { MusicEmbedsProvider, MusicManagerProvider, MusicServiceProvider } from ".";
import { ChannelEvents, NodeEvents, PlayerEvents, QueueEvents, TrackEvents, VoiceEvents } from "./events";

@Global()
@Module({
	imports: [],
	providers: [
		NodeEvents,
		PlayerEvents,
		QueueEvents,
		TrackEvents,
		ChannelEvents,
		VoiceEvents,
		TranslateProvider,
		DatabaseProvider,
		MusicManagerProvider,
		MusicEmbedsProvider,
		MusicServiceProvider,
	],
})
export class MusicModule {}
