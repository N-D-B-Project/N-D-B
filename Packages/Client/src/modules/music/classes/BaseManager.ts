import { LavalinkManagerEvents, NodeManagerEvents } from "@/modules/music/types/lavalink-client";
import { Config } from "@/types";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Client } from "discord.js";
import { LavalinkManager, ManagerQueueOptions } from "lavalink-client";

export class BaseManager extends LavalinkManager {
	public constructor(
		private readonly client: Client,
		private readonly config: ConfigService,
		private readonly eventEmitter: EventEmitter2,
		{ clientOptions, queueOptions, debugOptions }: Options,
	) {
		const logger = new Logger(clientOptions.username);
		super({
			nodes: [
				{
					regions: ["us-east", "us-central", "us-south", "us-west", "brazil"],
					id: "localhost",
					host: process.env.LavalinkHOST,
					port: 2333,
					authorization: process.env.LavalinkPassword,
					retryAmount: 22,
					retryDelay: 5000,
				},
			],
			client: {
				id: config.getOrThrow<Config["Discord"]>("Discord").Client.ID,
				username: clientOptions.username,
			},
			autoSkip: true,
			playerOptions: {
				applyVolumeAsFilter: false,
				clientBasedPositionUpdateInterval: 100,
				defaultSearchPlatform: "ytmsearch",
				volumeDecrementer: config.getOrThrow<Config["Music"]>("Music").Volumes.Lavalink,
				useUnresolvedData: true,
				onDisconnect: {
					autoReconnect: false,
					destroyPlayer: false,
				},
			},
			queueOptions,
			sendToShard(id, payload) {
				const guild = client.guilds.cache.get(id);
				if (!guild) {
					return logger.error("sendToShard - guild not found: ", id);
				}
				if (!guild.shard) {
					return logger.error("sendToShard - guild has no shard not found: ", guild);
				}
				return guild.shard.send(payload);
			},
			advancedOptions: {
				debugOptions,
			},
		});

		this.setMaxListeners(15);
		this.nodeManager.setMaxListeners(8);

		const LavalinkManagerEvents: Partial<LavalinkManagerEvents> = {
			trackStart: (player, track, payload) => this.eventEmitter.emit("track.start", player, track, payload),
			trackEnd: (player, track, payload) => this.eventEmitter.emit("track.end", player, track, payload),
			trackStuck: (player, track, payload) => this.eventEmitter.emit("track.stuck", player, track, payload),
			trackError: (player, track, payload) => this.eventEmitter.emit("track.error", player, track, payload),
			queueEnd: (player, track, payload) => this.eventEmitter.emit("queue.end", player, track, payload),
			playerCreate: (player) => this.eventEmitter.emit("player.create", player),
			playerMove: (player, oldVoiceChannelId, newVoiceChannelId) =>
				this.eventEmitter.emit("player.move", player, oldVoiceChannelId, newVoiceChannelId),
			playerDisconnect: (player, voiceChannelId) => this.eventEmitter.emit("player.disconnect", player, voiceChannelId),
			// playerSocketClosed: (player, payload) => this.eventEmitter.emit("player.socketClosed", player, payload),
			playerDestroy: (player, destroyReason) => this.eventEmitter.emit("player.destroy", player, destroyReason),
			// playerUpdate: (oldPlayerJson, newPlayer) => this.eventEmitter.emit("player.update", oldPlayerJson, newPlayer),
			// SegmentsLoaded: (player, track, payload) => this.eventEmitter.emit("segments.loaded", player, track, payload),
			// SegmentSkipped: (player, track, payload) => this.eventEmitter.emit("segments.skipped", player, track, payload),
			// ChapterStarted: (player, track, payload) => this.eventEmitter.emit("chapter.started", player, track, payload),
			// ChaptersLoaded: (player, track, payload) => this.eventEmitter.emit("chapter.loaded", player, track, payload),
		};
		const NodeManagerEvents: Partial<NodeManagerEvents> = {
			create: (node) => this.eventEmitter.emit("node.create", node, clientOptions.username),
			destroy: (node, destroyReason) =>
				this.eventEmitter.emit("node.destroy", node, destroyReason, clientOptions.username),
			connect: (node) => this.eventEmitter.emit("node.connect", node, clientOptions.username),
			reconnecting: (node) => this.eventEmitter.emit("node.reconnecting", node, clientOptions.username),
			disconnect: (node, reason) => this.eventEmitter.emit("node.disconnect", node, reason, clientOptions.username),
			error: (node, error, payload) =>
				this.eventEmitter.emit("node.error", node, error, payload, clientOptions.username),
			raw: (node, payload) => this.eventEmitter.emit("node.raw", node, payload, clientOptions.username),
			// resumed: (node, payload, players) =>
			// 	this.eventEmitter.emit("node.resumed", node, payload, players, clientOptions.username),
		};

		for (const event in LavalinkManagerEvents) {
			this.on(event as keyof LavalinkManagerEvents, LavalinkManagerEvents[event]);
		}

		for (const event in NodeManagerEvents) {
			this.nodeManager.on(event as keyof NodeManagerEvents, NodeManagerEvents[event]);
		}

		client.on("raw", (data) => {
			this.sendRawData(data);
		});
	}

	public async load(): Promise<void> {
		try {
			await this.init({ ...this.client.user });
		} catch (error) {
			console.log(error);
		}
	}
}

interface Options {
	clientOptions: {
		username: string;
	};
	queueOptions: ManagerQueueOptions;
	debugOptions?: {
		noAudio: boolean;
	};
}
