import type { NecordLavalinkModuleOptions } from "@necord/lavalink";
import {
	GuildResolver,
	type NecordLocalizationOptions,
	NestedLocalizationAdapter,
} from "@necord/localization";
import type { NecordPaginationOptions } from "@necord/pagination";
import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@nestjs/config";
import { InjectRedis, type Redis } from "@nestjs-redis/client";
import {
	GatewayIntentBits,
	GatewayVersion,
	Options,
	Partials,
} from "discord.js";
import { SourceLinksRegexes } from "lavalink-client";
import type { NecordModuleOptions } from "necord";
import { QueueStore } from "../music/utils/QueueStore";
import { JSONLocaleLoader } from "./JSONLocale.loader";
import { PlayerStore } from "./player.store";
import type { Config } from "./types";

@Injectable()
export class NecordConfigService {
	public constructor(
		private readonly config: ConfigService,
		@InjectRedis() private readonly redis: Redis,
	) {}

	public createNecordOptions(): NecordModuleOptions {
		return {
			token: this.config.getOrThrow<Config["Discord"]>("Discord").Token,
			skipRegistration: true,
			shards: "auto",
			rest: {
				version: GatewayVersion,
				offset: 0,
				api: "https://discord.com/api/",
				cdn: "https://cdn.discordapp.com",
			},
			failIfNotExists: true,
			allowedMentions: {
				parse: ["roles", "users"],
				repliedUser: false,
			},
			makeCache: Options.cacheWithLimits({
				...Options.DefaultMakeCacheSettings,
				GuildMemberManager: {
					maxSize: 200,
					keepOverLimit: (member) => member.id === member.client.user.id,
				},
			}),
			sweepers: {
				...Options.DefaultSweeperSettings,
				messages: {
					interval: 3600,
					lifetime: 1800,
				},
				users: {
					interval: 3600,
					filter: () => (user) => user.bot && user.id !== user.client.user.id,
				},
			},
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.GuildScheduledEvent,
				Partials.Message,
				Partials.Reaction,
				Partials.ThreadMember,
				Partials.User,
			],
			intents: [
				GatewayIntentBits.DirectMessageReactions,
				GatewayIntentBits.DirectMessageTyping,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildIntegrations,
				GatewayIntentBits.GuildInvites,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildMessageTyping,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildScheduledEvents,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildWebhooks,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.AutoModerationConfiguration,
				GatewayIntentBits.AutoModerationExecution,
			],
		};
	}

	public createNecordPaginationOptions(): NecordPaginationOptions {
		return {
			allowSkip: false,
			allowTraversal: false,
			buttonsPosition: "end",
		};
	}

	public async createNecordLocalizationOptions(): Promise<NecordLocalizationOptions> {
		return {
			adapter: new NestedLocalizationAdapter({
				fallbackLocale:
					this.config.getOrThrow<Config["FallbackLocale"]>("FallbackLocale"),
				locales: await new JSONLocaleLoader(
					"./src/common/Languages/",
				).loadTranslations(),
			}),
			resolvers: GuildResolver,
		};
	}

	public createNecordLavalinkOptions(): NecordLavalinkModuleOptions {
		return {
			nodes: [
				{
					regions: ["us-east", "us-central", "us-south", "us-west", "brazil"],
					authorization: process.env.LAVALINK_SERVER_PASSWORD,
					host: process.env.LavalinkHost as string,
					port: Number(process.env.LavalinkPort),
					id: "ndlavalink",
					retryAmount: 4,
					retryDelay: 4000,
				},
			],
			autoResume: {
				playerStore: new PlayerStore(this.redis),
				timer: 360e3,
			},
			autoSkip: true,
			playerOptions: {
				applyVolumeAsFilter: true,
				clientBasedPositionUpdateInterval: 100,
				defaultSearchPlatform: "ytmsearch",
				volumeDecrementer:
					this.config.getOrThrow<Config["Music"]>("Music").Volumes.Lavalink,
				useUnresolvedData: true,
				onDisconnect: {
					autoReconnect: false,
					destroyPlayer: false,
				},
			},
			queueOptions: {
				maxPreviousTracks: 10,
				queueStore: new QueueStore(this.redis),
			},
			linksWhitelist: [
				SourceLinksRegexes.YoutubeMusicRegex,
				SourceLinksRegexes.YoutubeRegex,
				SourceLinksRegexes.AllSpotifyRegex,
			],
			advancedOptions: {
				enableDebugEvents:
					this.config.getOrThrow<Config["Debug"]>("Debug").Lavalink,
			},
		};
	}
}
