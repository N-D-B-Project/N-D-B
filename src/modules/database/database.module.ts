import { Services } from "@/types/Constants";
import { Global, Module, type Provider } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { DatabaseService } from "./database.service";
import { RepositoriesModule } from "./repositories/Repositories.module";

const provider: Provider<DatabaseService> = {
	provide: Services.Database,
	useClass: DatabaseService,
};

@Global()
@Module({
	imports: [
		PrismaModule.forRootAsync({
			isGlobal: true,
			useFactory: () => ({
				prismaOptions: {
					log: ["info"],
				},
				explicitConnect: false,
			}),
		}),
		RepositoriesModule,
	],
	providers: [provider],
	exports: [provider],
})
export class DatabaseModule {}
