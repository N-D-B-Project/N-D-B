import { InteractionTools } from "@/modules/commands/Interaction";
import { MessageTools } from "@/modules/commands/Message";
import type { Config } from "@/modules/config/types";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	LAVALINK_MODULE_OPTIONS,
	NecordLavalinkModuleOptions,
	type NodeManagerContextOf,
	OnNodeManager,
	PlayerManager,
} from "@necord/lavalink";
import { Inject, Injectable, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@nestjs/config";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	EmbedBuilder,
	UserManager,
} from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { LavalinkManager, NodeManager } from "lavalink-client";
import { Button, type ButtonContext, ComponentParam, Context } from "necord";
import { Music } from "../types/constants";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { PlayerSaver } from "../utils/PlayerSaver";

@Injectable()
export class LavalinkNodeEvents {
	public constructor(
		private readonly config: ConfigService,
		private readonly userManager: UserManager,
		private readonly nodeManager: NodeManager,
		private readonly playerManager: PlayerManager,
		private readonly lavalinkManager: LavalinkManager,
		private readonly client: Client,
		@Inject(Music.PlayerSaver)
		private readonly playerSaver: PlayerSaver,
		@Inject(LAVALINK_MODULE_OPTIONS)
		private readonly lavalinkOptions: NecordLavalinkModuleOptions,
	) {}

	private readonly logger = new Logger(LavalinkNodeEvents.name);
	private reconnectAttempts = 0;

	@OnNodeManager("connect")
	public async onNodeConnect(
		@Context() [node]: NodeManagerContextOf<"connect">,
	): Promise<void> {
		node.updateSession(true, 360e3);
		this.logger.log(`Node: \`${node.id}\` connected`);
	}

	@OnNodeManager("create")
	public onNodeCreate(@Context() [node]: NodeManagerContextOf<"create">): void {
		this.logger.log(`Node: \`${node.id}\` created`);
	}

	@OnNodeManager("destroy")
	public onNodeDestroy(
		@Context() [node, reason]: NodeManagerContextOf<"destroy">,
	): void {
		this.logger.log(`Node: \`${node.id}\` destroyed with reason: ${reason}`);
	}

	@OnNodeManager("disconnect")
	public async onNodeDisconnect(
		@Context() [node]: NodeManagerContextOf<"disconnect">,
	): Promise<void> {
		this.reconnectAttempts++;
		this.logger.log(`Node: \`${node.id}\` disconnected`);
		if (this.reconnectAttempts < 4) return;
		const owner = await this.userManager.fetch(
			this.config.getOrThrow<Config["Discord"]>("Discord").Client.Owners[0],
		);
		await MessageTools.send(owner, {
			embeds: [
				new EmbedBuilder()
					.setTitle("Node Disconnected")
					.setColor("#c20e00")
					.setDescription(`Node: \`${node.id}\``),
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents([
					new ButtonBuilder()
						.setCustomId(`lavalink/node/${node.id}`)
						.setLabel("Reconnect")
						.setStyle(ButtonStyle.Success),
				]),
			],
		});
	}

	@OnNodeManager("resumed")
	public async onNodeResumed(
		@Context() [node, payload, players]: NodeManagerContextOf<"resumed">,
	): Promise<void> {
		if (!Array.isArray(players)) {
			this.logger.log(`Node: \`${node.id}\` has no players to resume`);
			return;
		}
		this.logger.log(
			`Node: \`${node.id}\` started resuming ${players.length} players`,
		);
		for (const playerData of players) {
			const savedPlayer = await this.playerSaver.getPlayer(playerData.guildId);
			if (!playerData.state.connected) {
				await this.playerSaver.deletePlayer(playerData.guildId);
			}

			const player = this.playerManager.create({
				guildId: playerData.guildId,
				voiceChannelId: savedPlayer.voiceChannelId,
				textChannelId: savedPlayer.textChannelId,
				selfDeaf: savedPlayer.options?.selfDeaf || true,
				selfMute: savedPlayer.options?.selfMute || false,
				volume: this.lavalinkOptions.playerOptions?.volumeDecrementer
					? Math.round(
							playerData.volume /
								this.lavalinkOptions.playerOptions.volumeDecrementer,
						)
					: playerData.volume,
				node: node.id,
				applyVolumeAsFilter: savedPlayer.options.applyVolumeAsFilter,
				instaUpdateFiltersFix: savedPlayer.options.instaUpdateFiltersFix,
				vcRegion: savedPlayer.options.vcRegion,
			});

			await player.connect();

			player.filterManager.data = playerData.filters;
			await player.queue.utils.sync(true, false).catch(console.warn);
			if (playerData.track)
				player.queue.current = this.lavalinkManager.utils.buildTrack(
					playerData.track,
					player.queue.current?.requester || this.client.user,
				);

			player.lastPosition = playerData.state.position;
			player.lastPositionChange = Date.now();
			player.ping.lavalink = playerData.state.ping;
			player.paused = playerData.paused;
			player.playing = !playerData.paused && !!playerData.track;
		}

		this.logger.log(
			`Node: \`${node.id}\` finished resuming ${players.length} players`,
		);
	}

	@Button("lavalink/node/:id")
	public async onNodeReconnectButton(
		@Context() [interaction]: ButtonContext,
		@ComponentParam("id") id: string,
	) {
		const node = this.nodeManager.nodes.get(id);
		if (!node.connected) {
			node.connect();
			const message = await InteractionTools.editReply(interaction, {
				embeds: [
					new EmbedBuilder()
						.setTitle("Node Reconnected")
						.setColor("#00c26f")
						.setDescription(`Node: \`${node.id}\``),
				],
				components: [],
			});
			this.reconnectAttempts = 0;
			setTimeout(async () => await message.delete(), 5000);
		}
	}

	@OnNodeManager("error")
	public onNodeError(
		@Context() [node, error, payload]: NodeManagerContextOf<"error">,
	): void {
		this.logger.error(`Node: \`${node.id}\` emitted an error: ${error}`);
	}

	@OnNodeManager("reconnecting")
	public onNodeReconnect(
		@Context() [node]: NodeManagerContextOf<"reconnecting">,
	): void {
		this.logger.log(`Node: \`${node.id}\` reconnecting`);
	}

	@OnNodeManager("reconnectinprogress")
	public onNodeReconnectInProgress(
		@Context() [node]: NodeManagerContextOf<"reconnectinprogress">,
	): void {
		this.logger.log(`Node: \`${node.id}\` reconnect in progress`);
	}

	@OnNodeManager("raw")
	public onNodeRaw(
		@Context() [node, payload]: NodeManagerContextOf<"raw">,
	): void {
		if (this.config.getOrThrow<Config["Debug"]>("Debug").Lavalink) {
			this.logger.debug(`Node: \`${node.id}\` emitted a raw event: ${payload}`);
		}
	}
}
