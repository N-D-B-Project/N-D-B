import { NecordConfigService } from "@/modules/shared/config/NecordConfig.service";
import { SharedModule } from "@/modules/shared/shared.module";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { CommandsModule } from "../commands/Commands.module";
import { ComponentsModule } from "../components/Components.module";
import { DeveloperToolsModule } from "../developerTools/DeveloperTools.module";
import { EventsModule } from "../events/Events.module";
import { I18nModule } from "../i18n/i18n.module";
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
		SharedModule,
		I18nModule,
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
