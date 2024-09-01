import { Module, type OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { REST } from "discord.js";
import { GatewayEvents } from "./Gateway";
import { GuildEvents } from "./Guild";
import { NDCEvents } from "./NDC";
import { ThreadEvents } from "./Thread";

@Module({
	imports: [
		EventEmitterModule.forRoot({
			delimiter: ".",
			maxListeners: 10,
			global: true,
		}),
	],
	providers: [GatewayEvents, GuildEvents, ThreadEvents, NDCEvents],
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
