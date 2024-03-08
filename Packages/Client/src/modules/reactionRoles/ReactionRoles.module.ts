import { DatabaseProvider, TranslateProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";
import { ReactionRolesEvents } from "./events/ReactionRoles";
import { ReactionRolesEmbedsProvider, ReactionRolesProvider } from "./types/providers";

@Global()
@Module({
	providers: [
		ReactionRolesEvents,
		ReactionRolesProvider,
		ReactionRolesEmbedsProvider,
		DatabaseProvider,
		TranslateProvider,
	],
})
export class ReactionRolesModule {}
