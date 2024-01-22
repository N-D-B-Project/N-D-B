import {
	DatabaseProvider,
	ReactionRolesEmbedsProvider,
	ReactionRolesProvider,
	TranslateProvider,
} from "@/types/Providers";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [ReactionRolesProvider, ReactionRolesEmbedsProvider, DatabaseProvider, TranslateProvider],
})
export class ReactionRolesModule {}
