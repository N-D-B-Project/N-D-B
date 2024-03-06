import {
	CommandProvider,
	DatabaseProvider,
	ReactionRolesEmbedsProvider,
	ReactionRolesProvider,
	TranslateProvider,
} from "@/types/Providers";
import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { REST } from "discord.js";
import { CommandsEvents } from "./Commands";
import { GatewayEvents } from "./Gateway";
import { GuildEvents } from "./Guild";
import { MessageReactionEvents } from "./MessageReaction";
import { NotQuiteNitroEvent } from "./NotQuiteNitro";
import { ReactionRolesEvents } from "./ReactionRoles";
import { ThreadEvents } from "./Thread";
@Module({
	imports: [
		EventEmitterModule.forRoot({
			delimiter: ".",
			maxListeners: 10,
		}),
	],
	providers: [
		GatewayEvents,
		CommandsEvents,
		GuildEvents,
		ThreadEvents,
		NotQuiteNitroEvent,
		MessageReactionEvents,
		ReactionRolesEvents,
		DatabaseProvider,
		TranslateProvider,
		CommandProvider,
		ReactionRolesProvider,
		ReactionRolesEmbedsProvider,
	],
})
export class EventsModule implements OnApplicationBootstrap {
	public constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly rest: REST,
	) {}

	public async onApplicationBootstrap() {
		this.eventEmitter.emit("rest", this.rest);
	}
}
