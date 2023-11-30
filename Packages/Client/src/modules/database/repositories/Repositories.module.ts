import { GuildRepoProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [GuildRepoProvider],
  exports: [GuildRepoProvider]
})
export class RepositoriesModule {}
