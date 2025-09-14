// biome-ignore lint/style/useImportType: <explanation>
import {
	LAVALINK_MODULE_OPTIONS,
	NecordLavalinkModuleOptions,
} from "@necord/lavalink";
import {
	Global,
	Inject,
	Module,
	type OnApplicationBootstrap,
	type OnApplicationShutdown,
} from "@nestjs/common";
import { InjectRedis, type Redis } from "@nestjs-redis/client";
import * as CommandsMap from "./commands";
import * as EventsMap from "./events";
import * as ProvidersMap from "./types/providers";

const Commands = Object.values(CommandsMap);
const Events = Object.values(EventsMap);
const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	providers: [...Commands, ...Events, ...Providers],
	exports: [...Providers],
})
export class MusicModule
	implements OnApplicationShutdown, OnApplicationBootstrap
{
	public constructor(
		@InjectRedis() private readonly redis: Redis,
		@Inject(LAVALINK_MODULE_OPTIONS)
		readonly lavalinkOptions: NecordLavalinkModuleOptions,
	) {}

	public async onApplicationShutdown(_signal?: string) {
		const playerKeys = await this.redis.sMembers("players:keys");
		for (const key of playerKeys) {
			await this.redis.expire(
				key,
				this.lavalinkOptions.autoResume.timer / 1000,
			);
		}
	}

	public async onApplicationBootstrap() {
		const playerKeys = await this.redis.sMembers("players:keys");
		for (const key of playerKeys) {
			await this.redis.persist(key);
		}
	}
}
