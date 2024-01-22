import { GuildRepoProvider, ReactionRolesRepoProvider, UserRepoProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [GuildRepoProvider, UserRepoProvider, ReactionRolesRepoProvider],
	exports: [GuildRepoProvider, UserRepoProvider, ReactionRolesRepoProvider],
})
export class RepositoriesModule {}
