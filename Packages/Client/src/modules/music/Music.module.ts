import { NDBServiceProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";
import { MusicEmbedsProvider, MusicManagerProvider, MusicServiceProvider } from ".";
import {
	JoinCommand,
	LeaveCommand,
	MusicMainSlashCommand,
	NowPlayingCommand,
	PauseCommand,
	PlayCommand,
	QueueCommand,
	ResumeCommand,
	StopCommand,
} from "./commands";
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
		MusicMainSlashCommand,
		JoinCommand,
		LeaveCommand,
		NowPlayingCommand,
		PauseCommand,
		PlayCommand,
		QueueCommand,
		ResumeCommand,
		StopCommand,
		NDBServiceProvider,
		MusicManagerProvider,
		MusicEmbedsProvider,
		MusicServiceProvider,
	],
	exports: [MusicManagerProvider, MusicEmbedsProvider, MusicServiceProvider],
})
export class MusicModule {}
