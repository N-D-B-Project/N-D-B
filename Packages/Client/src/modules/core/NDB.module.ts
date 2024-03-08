import { NecordConfigService } from "@/modules/config/NecordConfig.service";
import { DatabaseProvider, NDBServiceProvider, TranslateProvider } from "@/types/Providers";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { CommandsModule } from "../commands/Commands.module";
import { DeveloperToolsCommands } from "../commands/🛠️ Developer Tools/Category.module";
import { ComponentsModule } from "../components/Components.module";
import { DatabaseModule } from "../database/database.module";
import { EventsModule } from "../events/Events.module";
import { i18nModule } from "../i18n/i18n.module";
import { MusicModule } from "../music/Music.module";
import { MusicCommands } from "../music/commands/Category.module";
import { ReactionRolesModule } from "../reactionRoles/ReactionRoles.module";
import { ReactionRolesCommands } from "../reactionRoles/commands/Category.module";

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
		ReactionRolesModule,
		CommandsModule,
		MusicModule,
		EventsModule,
		DeveloperToolsCommands,
		ReactionRolesCommands,
		MusicCommands,
	],
	providers: [NDBServiceProvider, TranslateProvider, DatabaseProvider],
})
export class NDBModule {}
