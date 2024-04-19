import { Global, Module } from "@nestjs/common";
import * as Commands from "./commands";
import { ReactionRolesEvents } from "./events/ReactionRoles";
import { ReactionRolesEmbedsProvider, ReactionRolesProvider } from "./types/providers";
//...Object.values(Commands)
@Global()
@Module({
	providers: [ReactionRolesEvents, ReactionRolesProvider, ReactionRolesEmbedsProvider],
	exports: [ReactionRolesProvider, ReactionRolesEmbedsProvider],
})
export class ReactionRolesModule {}
