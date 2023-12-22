import { GuildRepoProvider, UserRepoProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [GuildRepoProvider, UserRepoProvider],
	exports: [GuildRepoProvider, UserRepoProvider],
})
export class RepositoriesModule {}
