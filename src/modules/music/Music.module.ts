import { Global, Module } from "@nestjs/common";
import * as CommandsMap from "./commands";
import * as EventsMap from "./events";
import * as ProvidersMap from "./types/providers";
const Commands = Object.values(CommandsMap);
const Events = Object.values(EventsMap);
const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	providers: [...Commands, ...Events, ...Providers],
})
export class MusicModule {}
