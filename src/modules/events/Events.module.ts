import { Module, type OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitterModule, type EventEmitter2 } from "@nestjs/event-emitter";
import type { REST } from "discord.js";
import { GatewayEvents } from "./Gateway";
import { GuildEvents } from "./Guild";
import { ThreadEvents } from "./Thread";

@Module({
	imports: [
		EventEmitterModule.forRoot({
			delimiter: ".",
			maxListeners: 10,
		}),
	],
	providers: [GatewayEvents, GuildEvents, ThreadEvents],
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
