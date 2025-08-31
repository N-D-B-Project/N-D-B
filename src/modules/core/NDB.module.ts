import * as Modules from "@/modules";
import { NecordLavalinkModule } from "@necord/lavalink";
import { NecordLocalizationModule } from "@necord/localization";
import { NecordPaginationModule } from "@necord/pagination";
import { RedisModule, RedisToken } from "@nestjs-redis/client";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { NecordConfigService, config } from "../config";
import { Music } from "../music/types/constants";
import { NDBServiceProvider } from "./provider/NDBService.provider";

const NecordConfigInjectionTokens = [
	ConfigService,
	RedisToken(),
	Music.PlayerSaver,
];

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
		RedisModule.forRoot({
			isGlobal: true,
			options: { url: "redis://localhost:6379" },
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
