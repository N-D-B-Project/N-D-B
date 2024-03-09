import { DatabaseProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";
import { AlsModule } from "./als/als.module";
import { PrismaModule } from "./prisma/Prisma.module";
import { RepositoriesModule } from "./repositories/Repositories.module";

@Global()
@Module({
	imports: [AlsModule, RepositoriesModule, PrismaModule],
	providers: [DatabaseProvider],
	exports: [DatabaseProvider],
})
export class DatabaseModule {}
