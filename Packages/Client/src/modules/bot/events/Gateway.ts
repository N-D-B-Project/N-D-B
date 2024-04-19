import { Config } from "@/modules/shared/config/types";
import { IDatabaseService } from "@/modules/shared/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { RESTJSONErrorCodes } from "discord-api-types/v10";
import { ActivityType, Client, DiscordAPIError, PresenceData, REST, RateLimitData } from "discord.js";
import { Context, ContextOf, On, Once } from "necord";

@Injectable()
export class GatewayEvents {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		private readonly config: ConfigService<Config>,
	) {}

	private readonly logger = new Logger(GatewayEvents.name);

	private IGNORED_ERRORS = [
		RESTJSONErrorCodes.UnknownMessage,
		RESTJSONErrorCodes.UnknownChannel,
		RESTJSONErrorCodes.UnknownGuild,
		RESTJSONErrorCodes.UnknownUser,
		RESTJSONErrorCodes.UnknownInteraction,
		// User blocked bot or DM disabled
		RESTJSONErrorCodes.CannotSendMessagesToThisUser,
		// User blocked bot or DM disabled
		RESTJSONErrorCodes.ReactionWasBlocked,
		RESTJSONErrorCodes.MaximumActiveThreads,
	];

	@Once("ready")
	public async onReady(@Context() [client]: ContextOf<"ready">) {
		this.logger.log(`Bot logged in as ${client.user.username}`);
		await this._setPresence(client);
		for (const guild of client.guilds.cache.values()) {
			if (!(await this.database.GuildRepo().get(guild.id))) {
				await this.database.GuildRepo().create(guild);
			}
		}
	}

	@On("warn")
	public onWarn(@Context() [data]: ContextOf<"warn">) {
		this.logger.warn(data);
	}

	@Once("debug")
	public async onDebug(@Context() [data]: ContextOf<"debug">) {
		if (this.config.getOrThrow<Config["Debug"]>("Debug").Client) this.logger.debug(data);
	}

	@On("error")
	public async onError(@Context() [error]: ContextOf<"error">) {
		if (
			error instanceof DiscordAPIError &&
			typeof error.code === "number" &&
			this.IGNORED_ERRORS.includes(error.code)
		) {
			return;
		}
		this.logger.error(`\nMessage: ${error.message}\nCause: ${error.stack}`);
	}

	@OnEvent("rest")
	public async onRest(rest: REST) {
		rest.on("rateLimited", async ({ majorParameter, timeToReset, route, method }: RateLimitData) => {
			this.logger.fatal(`RateLimit on route: ${method} ${route} ${majorParameter}, Time: ${timeToReset}ms`);
		});
	}

	private async _setPresence(client: Client) {
		const presences: PresenceData = {
			activities: [
				{
					type: ActivityType.Custom,
					name: "WorkingAt",
					state: `${""}N-D-B | 🎵 Music Player - 🚧 WIP`,
					url: "https://discord.gg/5CHARxbaRk",
				},
				{
					type: ActivityType.Watching,
					name: "Best Bot of Discord",
				},
				{
					type: ActivityType.Streaming,
					name: "Watch my Creator Streams on Twitch!",
					url: "https://Twitch.TV/NedcloarBR",
				},
				{
					type: ActivityType.Custom,
					name: "TotalStatus",
					state: `👤 ${client.users.cache.size} Users - 🏠 ${client.guilds.cache.size} Guilds`,
				},
			],
			status: "dnd",
		};

		function setPresence() {
			const activity = presences.activities[Math.floor(Math.random() * presences.activities.length)];
			client.user.setPresence({
				activities: [activity],
			});
		}
		setPresence();
		setInterval(() => setPresence(), 120_000);
	}
}
