import { Global, Module } from "@nestjs/common";
import * as Commands from "./commands";
import { ReactionRolesEvents } from "./events/ReactionRoles";
import {
	ReactionRolesEmbedsProvider,
	ReactionRolesProvider,
} from "./types/providers";
@Global()
@Module({
	providers: [
		ReactionRolesEvents,
		ReactionRolesProvider,
		ReactionRolesEmbedsProvider,
		...Object.values(Commands),
	],
	exports: [ReactionRolesProvider, ReactionRolesEmbedsProvider],
})
export class ReactionRolesModule {}
