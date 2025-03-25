import { InteractionTools } from "@/modules/commands/Interaction";
import { MessageTools } from "@/modules/commands/Message";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@/modules/config";
import { Services } from "@/types";
import { type NodeManagerContextOf, OnNodeManager } from "@necord/lavalink";
import { Inject, Injectable, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	UserManager,
} from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { NodeManager } from "lavalink-client";
import { Button, type ButtonContext, ComponentParam, Context } from "necord";

@Injectable()
export class LavalinkNodeEvents {
	public constructor(
		@Inject(Services.Config) private readonly configService: ConfigService,
		private readonly userManger: UserManager,
		private readonly nodeManger: NodeManager,
	) {}

	private readonly logger = new Logger(LavalinkNodeEvents.name);
	private reconnectAttempts = 0;

	@OnNodeManager("connect")
	public async onNodeConnect(
		@Context() [node]: NodeManagerContextOf<"connect">,
	): Promise<void> {
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
		const owner = await this.userManger.fetch(
			this.configService.get("Discord").Client.Owners[0],
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

	@Button("lavalink/node/:id")
	public async onNodeReconnectButton(
		@Context() [interaction]: ButtonContext,
		@ComponentParam("id") id: string,
	) {
		const node = this.nodeManger.nodes.get(id);
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
		if (this.configService.get("Debug").Lavalink) {
			this.logger.debug(`Node: \`${node.id}\` emitted a raw event: ${payload}`);
		}
	}
}
