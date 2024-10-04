import { Config } from "@/modules/config/types";
import { NodeManagerContextOf, OnNodeManager } from "@necord/lavalink";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Context } from "necord";

@Injectable()
export class LavalinkNodeEvents {
	public constructor(private readonly config: ConfigService) {}

	private readonly logger = new Logger(LavalinkNodeEvents.name);

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
	public onNodeDisconnect(
		@Context() [node]: NodeManagerContextOf<"disconnect">,
	): void {
		this.logger.log(`Node: \`${node.id}\` disconnected`);
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
