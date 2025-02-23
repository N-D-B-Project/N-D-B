import { Services } from "@/types/Constants";
import { Global, Module, type Provider } from "@nestjs/common";
import { CustomPrismaModule } from "nestjs-prisma";
import { DatabaseService } from "./database.service";
import { extendedPrismaClient } from "./prisma.client";
import { RepositoriesModule } from "./repositories/Repositories.module";

const provider: Provider<DatabaseService> = {
	provide: Services.Database,
	useClass: DatabaseService,
};

@Global()
@Module({
	imports: [
		CustomPrismaModule.forRootAsync({
			isGlobal: true,
			name: Services.Prisma,
			useFactory: () => extendedPrismaClient,
		}),
		RepositoriesModule,
	],
	providers: [provider],
	exports: [provider],
})
export class DatabaseModule {}
