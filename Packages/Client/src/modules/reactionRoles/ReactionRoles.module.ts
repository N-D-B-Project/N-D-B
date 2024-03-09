import { Global, Module } from "@nestjs/common";
import { ReactionRolesEvents } from "./events/ReactionRoles";
import { ReactionRolesEmbedsProvider, ReactionRolesProvider } from "./types/providers";

import {
	CreateReactionCommand,
	DeleteAllReactionsCommand,
	DeleteReactionCommand,
	EditReactionCommand,
	ReactionRolesMainSlashCommand,
	ReactionTypesCommand,
} from "./commands";

@Global()
@Module({
	providers: [
		ReactionRolesMainSlashCommand,
		ReactionRolesEvents,
		CreateReactionCommand,
		DeleteAllReactionsCommand,
		DeleteReactionCommand,
		EditReactionCommand,
		ReactionTypesCommand,
		ReactionRolesProvider,
		ReactionRolesEmbedsProvider,
	],
	exports: [ReactionRolesProvider, ReactionRolesEmbedsProvider],
})
export class ReactionRolesModule {}
