import * as Modules from "@/modules";
import { NecordLocalizationModule } from "@necord/localization";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { NecordConfigService, config } from "../config";
import { NDBServiceProvider } from "./provider/NDBService.provider";

@Module({
	imports: [
		NecordModule.forRootAsync({
			inject: [ConfigService],
			useClass: NecordConfigService,
		}),
		NecordPaginationModule.forRootAsync({
			useClass: NecordConfigService,
		}),
		NecordLocalizationModule.forRootAsync({
			inject: [ConfigService],
			useClass: NecordConfigService,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
		...Object.values(Modules),
	],
	providers: [NDBServiceProvider],
	exports: [NDBServiceProvider],
})
export class NDBModule {}
