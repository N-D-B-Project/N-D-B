import { Global, Module } from "@nestjs/common";
import { MusicEmbedsProvider, MusicManagerProvider, MusicServiceProvider } from ".";
import { NDBServiceProvider } from "../core/provider/NDBService.provider";
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
		MusicManagerProvider,
		MusicEmbedsProvider,
		MusicServiceProvider,
		NDBServiceProvider,
	],
	exports: [MusicManagerProvider, MusicEmbedsProvider, MusicServiceProvider],
})
export class MusicModule {}
