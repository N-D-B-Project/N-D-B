import {
	GuildResolver,
	NecordLocalizationModule,
	NestedLocalizationAdapter,
} from "@necord/localization";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { CommandsModule } from "../commands/Commands.module";
import { ComponentsModule } from "../components/Components.module";
import { JSONLocaleLoader, NecordConfigService, config } from "../config";
import type { Config } from "../config/types";
import { DatabaseModule } from "../database/database.module";
import { EventsModule } from "../events/Events.module";
import { ReactionRolesModule } from "../reactionRoles/ReactionRoles.module";
import { ScheduleModule } from "../schedule/schedule.module";
import { NDBServiceProvider } from "./provider/NDBService.provider";

@Module({
	imports: [
		NecordModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				...new NecordConfigService(config).createNecordOptions(),
			}),
		}),
		NecordPaginationModule.forRoot({
			allowSkip: false,
			allowTraversal: false,
			buttonsPosition: "end",
		}),
		NecordLocalizationModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				adapter: new NestedLocalizationAdapter({
					fallbackLocale:
						config.getOrThrow<Config["FallbackLocale"]>("FallbackLocale"),
					locales: await new JSONLocaleLoader(
						"./src/common/Languages/",
					).loadTranslations(),
				}),
				resolvers: GuildResolver,
			}),
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
		DatabaseModule,
		ScheduleModule,
		CommandsModule,
		ComponentsModule,
		EventsModule,
		ReactionRolesModule,
	],
	providers: [NDBServiceProvider],
	exports: [NDBServiceProvider],
})
export class NDBModule {}
