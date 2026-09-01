import { Global, Module } from "@nestjs/common";
import * as CommandsMap from "./commands/index.js";
import * as EventsMap from "./events/index.js";
import {
	ReactionRolesEmbedsProvider,
	ReactionRolesProvider,
} from "./types/providers.js";

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
