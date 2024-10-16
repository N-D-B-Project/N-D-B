import { Module, type OnApplicationBootstrap } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { REST } from "discord.js";
import * as EventsMap from "./index";
const Events = Object.values(EventsMap);

@Module({
	imports: [
		EventEmitterModule.forRoot({
			delimiter: ".",
			maxListeners: 10,
			global: true,
		}),
	],
	providers: [...Events],
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
