import { NecordConfigService } from "@/modules/config/NecordConfig.service";
import { NDBServiceProvider } from "@/types/Providers";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { CommandsModule } from "../commands/Commands.module";
import { ComponentsModule } from "../components/Components.module";
import { DatabaseModule } from "../database/database.module";
import { DeveloperToolsModule } from "../developerTools/DeveloperTools.module";
import { EventsModule } from "../events/Events.module";
import { i18nModule } from "../i18n/i18n.module";
import { MusicModule } from "../music/Music.module";
import { ReactionRolesModule } from "../reactionRoles/ReactionRoles.module";

@Module({
	imports: [
		NecordModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				...new NecordConfigService(config).createNecordOptions(),
			}),
		}),
		NecordPaginationModule.forRoot({
			allowSkip: false,
			allowTraversal: false,
		}),
		DatabaseModule,
		i18nModule,
		ComponentsModule,
		EventsModule,
		CommandsModule,
		DeveloperToolsModule,
		ReactionRolesModule,
		MusicModule,
	],
	providers: [NDBServiceProvider],
})
export class NDBModule {}
