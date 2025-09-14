import { NecordLavalinkModule } from "@necord/lavalink";
import { NecordLocalizationModule } from "@necord/localization";
import { NecordPaginationModule } from "@necord/pagination";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule, RedisToken } from "@nestjs-redis/client";
import { NecordModule } from "necord";
import * as Modules from "@/modules";
import { config, NecordConfigService } from "../config";
import { NDBServiceProvider } from "./provider/NDBService.provider";

const NecordConfigInjectionTokens = [ConfigService, RedisToken()];

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
		RedisModule.forRootAsync({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					options: {
						url: configService.get<string>("RedisURL"),
					},
				};
			},
		}),
		NecordModule.forRootAsync({
			inject: NecordConfigInjectionTokens,
			useClass: NecordConfigService,
		}),
		NecordPaginationModule.forRootAsync({
			useClass: NecordConfigService,
		}),
		NecordLocalizationModule.forRootAsync({
			inject: NecordConfigInjectionTokens,
			useClass: NecordConfigService,
		}),
		NecordLavalinkModule.forRootAsync({
			inject: NecordConfigInjectionTokens,
			useClass: NecordConfigService,
		}),
		...Object.values(Modules),
	],
	providers: [NDBServiceProvider],
	exports: [NDBServiceProvider],
})
export class NDBModule {}
