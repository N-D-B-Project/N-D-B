import { Global, Module } from "@nestjs/common";
import * as ProvidersMap from "./Music.providers";
import * as CommandsMap from "./commands";
import * as EventsMap from "./events";
const Commands = Object.values(CommandsMap);
const Events = Object.values(EventsMap);
const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	providers: [...Commands, ...Events, ...Providers],
})
export class MusicModule {}
