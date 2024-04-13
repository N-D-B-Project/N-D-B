import { JSONLocaleLoader } from "@/modules/shared/config/JSONLocale.loader";
import { NecordConfigService } from "@/modules/shared/config/NecordConfig.service";
import { Config } from "@/modules/shared/config/types";
import { SharedModule } from "@/modules/shared/shared.module";
import { GuildResolver, NecordLocalizationModule, NestedLocalizationAdapter } from "@necord/localization";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { CommandsModule } from "../commands/Commands.module";
import { ComponentsModule } from "../components/Components.module";
import { DeveloperToolsModule } from "../developerTools/DeveloperTools.module";
import { EventsModule } from "../events/Events.module";
import { MusicModule } from "../music/Music.module";
import { ReactionRolesModule } from "../reactionRoles/ReactionRoles.module";
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
		}),
		NecordLocalizationModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				adapter: new NestedLocalizationAdapter({
					fallbackLocale: config.getOrThrow<Config["FallbackLocale"]>("FallbackLocale"),
					locales: await new JSONLocaleLoader("./src/common/Languages/i18n").loadTranslations(),
				}),
				resolvers: GuildResolver,
			}),
		}),
		SharedModule,
		ComponentsModule,
		EventsModule,
		CommandsModule,
		DeveloperToolsModule,
		ReactionRolesModule,
		MusicModule,
	],
	providers: [NDBServiceProvider],
	exports: [NDBServiceProvider],
})
export class NDBModule {}
