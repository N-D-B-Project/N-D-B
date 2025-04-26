import * as Modules from "@/modules";
import { Services } from "@/types/Constants";
import { NecordLavalinkModule } from "@necord/lavalink";
import { NecordLocalizationModule } from "@necord/localization";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { NecordConfigService } from "../config";
import { NDBServiceProvider } from "./provider/NDBService.provider";

@Module({
	imports: [
		NecordModule.forRootAsync({
			inject: [Services.Config],
			useClass: NecordConfigService,
		}),
		NecordPaginationModule.forRootAsync({
			useClass: NecordConfigService,
		}),
		NecordLocalizationModule.forRootAsync({
			inject: [Services.Config],
			useClass: NecordConfigService,
		}),
		NecordLavalinkModule.forRootAsync({
			inject: [Services.Config],
			useClass: NecordConfigService,
		}),
		...Object.values(Modules),
	],
	providers: [NDBServiceProvider],
	exports: [NDBServiceProvider],
})
export class NDBModule {}
