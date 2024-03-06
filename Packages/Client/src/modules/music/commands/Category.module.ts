import { DatabaseProvider, NDBServiceProvider, TranslateProvider } from "@/types/Providers";
import { Module } from "@nestjs/common";
import {
	JoinCommand,
	LeaveCommand,
	MusicMainSlashCommand,
	NowPlayingCommand,
	PauseCommand,
	PlayCommand,
	ResumeCommand,
} from ".";
import { MusicEmbedsProvider, MusicManagerProvider, MusicServiceProvider } from "../";
import { QueueCommand } from "./Queue.command";

@Module({
	providers: [
		JoinCommand,
		LeaveCommand,
		MusicMainSlashCommand,
		NowPlayingCommand,
		PauseCommand,
		PlayCommand,
		QueueCommand,
		ResumeCommand,
		NDBServiceProvider,
		DatabaseProvider,
		TranslateProvider,
		MusicEmbedsProvider,
		MusicManagerProvider,
		MusicServiceProvider,
	],
})
export class MusicCommands {}
