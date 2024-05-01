import { Config } from "@/modules/shared/config/types";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { LavalinkNode } from "lavalink-client";

@Injectable()
export class NodeEvents {
	public constructor(private readonly config: ConfigService) {}

	private readonly logger = new Logger(NodeEvents.name);

	@OnEvent("node.create")
	public async onNodeCreate(node: LavalinkNode, username: string): Promise<void> {
		this.logger.log(`${username} | Lavalink Node: ${node.options.id} criado!`);
	}

	@OnEvent("node.destroy")
	public async onNodeDestroy(node: LavalinkNode, destroyReason: string, username: string): Promise<void> {
		this.logger.fatal(`${username} | Lavalink Node: ${node.options.id} destruído pelo motivo: ${destroyReason}`);
	}

	@OnEvent("node.connect")
	public async onNodeConnect(node: LavalinkNode, username: string): Promise<void> {
		this.logger.log(`${username} | Lavalink Node: ${node.options.id} Conectado!`);
	}

	@OnEvent("node.reconnecting")
	public async onNodeReconnecting(node: LavalinkNode, username: string): Promise<void> {
		this.logger.warn(`${username} | Lavalink Node: ${node.options.id} Reconectando...`);
	}

	@OnEvent("node.disconnect")
	public async onNodeDisconnect(
		node: LavalinkNode,
		reason: { code: number; reason: string },
		username: string,
	): Promise<void> {
		this.logger.error(
			`${username} | Lavalink Node: ${node.options.id} Desconectado. Código: ${reason.code}, Motivo: ${reason.reason}`,
		);
	}

	@OnEvent("node.error")
	public async onNodeError(node: LavalinkNode, error: Error, payload: unknown, username: string): Promise<void> {
		this.logger.error(`${username} | Lavalink Node: ${node.options.id} Error: ${error.message}`);
	}

	@OnEvent("node.raw")
	public async onNodeRaw(node: LavalinkNode, payload: unknown, username: string): Promise<void> {
		if (this.config.getOrThrow<Config["Debug"]>("Debug").Lavalink) {
			this.logger.debug(`${username} | Lavalink Node: ${node.options.id} Raw: \n${JSON.stringify(payload, null, 2)}`);
		}
	}
}
