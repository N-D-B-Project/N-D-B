import { Services } from "@/types/Constants";
import { Global, Module, Provider } from "@nestjs/common";
import { AlsModule } from "./als/als.module";
import { DatabaseService } from "./database.service";
import { PrismaModule } from "./prisma/Prisma.module";
import { RepositoriesModule } from "./repositories/Repositories.module";

const provider: Provider<DatabaseService> = {
	provide: Services.Database,
	useClass: DatabaseService,
};

@Global()
@Module({
	imports: [AlsModule, RepositoriesModule, PrismaModule],
	providers: [provider],
	exports: [provider],
})
export class DatabaseModule {}
