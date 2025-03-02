import { Global, Module } from "@nestjs/common";
import * as CommandsMap from "./commands";
import * as EventsMap from "./events";
import {
	ReactionRolesEmbedsProvider,
	ReactionRolesProvider,
} from "./types/providers";
const Commands = Object.values(CommandsMap);
const Events = Object.values(EventsMap);
@Global()
@Module({
	providers: [
		ReactionRolesProvider,
		ReactionRolesEmbedsProvider,
		...Commands,
		...Events,
	],
	exports: [ReactionRolesProvider, ReactionRolesEmbedsProvider],
})
export class ReactionRolesModule {}
