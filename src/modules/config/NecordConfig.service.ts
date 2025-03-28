import { Services } from "@/types";
import type { NecordLavalinkModuleOptions } from "@necord/lavalink";
import {
	GuildResolver,
	type NecordLocalizationOptions,
	NestedLocalizationAdapter,
} from "@necord/localization";
import type { NecordPaginationOptions } from "@necord/pagination";
import { Inject, Injectable } from "@nestjs/common";
import {
	GatewayIntentBits,
	GatewayVersion,
	Options,
	Partials,
} from "discord.js";
import { SourceLinksRegexes } from "lavalink-client";
import type { NecordModuleOptions } from "necord";
import { JSONLocaleLoader } from "./JSONLocale.loader";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "./config.service";

@Injectable()
export class NecordConfigService {
	public constructor(
		@Inject(Services.Config) private readonly configService: ConfigService,
	) {}

	public createNecordOptions(): NecordModuleOptions {
		return {
			token: this.configService.get("Token"),
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
				fallbackLocale: this.configService.get("FallbackLocale"),
				locales: await new JSONLocaleLoader(
					"./src/common/Languages/",
				).loadTranslations(),
			}),
			resolvers: GuildResolver,
		};
	}

	public async createNecordLavalinkOptions(): Promise<NecordLavalinkModuleOptions> {
		return {
			nodes: [
				{
					regions: ["us-east", "us-central", "us-south", "us-west", "brazil"],
					authorization: "youshallnotpass",
					host: "localhost",
					port: 2333,
					id: "ndlavalink",
					retryAmount: 4,
					retryDelay: 4000,
				},
			],
			autoSkip: true,
			playerOptions: {
				applyVolumeAsFilter: true,
				clientBasedPositionUpdateInterval: 100,
				defaultSearchPlatform: "ytmsearch",
				volumeDecrementer: this.configService.get("Volumes").Lavalink,
				useUnresolvedData: true,
				onDisconnect: {
					autoReconnect: false,
					destroyPlayer: false,
				},
			},
			queueOptions: {
				maxPreviousTracks: 10,
			},
			linksWhitelist: [
				SourceLinksRegexes.YoutubeMusicRegex,
				SourceLinksRegexes.YoutubeRegex,
				SourceLinksRegexes.AllSpotifyRegex,
			],
			advancedOptions: {
				enableDebugEvents: this.configService.get("Debug").Lavalink,
			},
		};
	}
}
