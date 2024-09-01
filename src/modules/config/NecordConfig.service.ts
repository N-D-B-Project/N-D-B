import { Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import {
	GatewayIntentBits,
	GatewayVersion,
	Options,
	Partials,
} from "discord.js";
import type { NecordModuleOptions } from "necord";
import { Config } from "./types";

@Injectable()
export class NecordConfigService {
	public constructor(private readonly config: ConfigService) {}

	createNecordOptions(): NecordModuleOptions {
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
			makeCache: Options.cacheEverything(),
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
		} as never;
	}
}
