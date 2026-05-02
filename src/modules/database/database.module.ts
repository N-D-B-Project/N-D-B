import {
	APIUser,
	Guild,
	GuildReactionRoles,
	GuildSettings,
	NamingStrategy,
	Tickets,
	TicketType,
	User,
	UserSettings,
} from "@ndb/database";
import { Global, Module, type Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Services } from "@/types/Constants";
import { DatabaseService } from "./database.service";
import { RepositoriesModule } from "./repositories/Repositories.module";

const provider: Provider<DatabaseService> = {
	provide: Services.Database,
	useClass: DatabaseService,
};

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => {
				const isProduction = config.get("NODE_ENV") === "production";
				return {
					type: "postgres",
					url: config.get("DATABASE_URL"),
					synchronize: false,
					logging: !isProduction,
					namingStrategy: new NamingStrategy(),
					extra: {
						max: parseInt(config.get("DB_POOL_SIZE") ?? "10", 10),
						idleTimeoutMillis: 30_000,
						connectionTimeoutMillis: 5_000,
					},
					entities: [
						Guild,
						GuildSettings,
						GuildReactionRoles,
						Tickets,
						TicketType,
						User,
						UserSettings,
						APIUser,
					],
				};
			},
			inject: [ConfigService],
		}),
		RepositoriesModule,
	],
	providers: [provider],
	exports: [provider],
})
export class DatabaseModule {}
