import { LavalinkManagerContextOf, OnLavalinkManager } from "@necord/lavalink";
import { Injectable, Logger } from "@nestjs/common";
import { Context } from "necord";

@Injectable()
export class LavalinkDebugEvents {
	private readonly logger = new Logger(LavalinkDebugEvents.name);

	@OnLavalinkManager("debug")
	public onDebug(@Context() [key, data]: LavalinkManagerContextOf<"debug">) {
		if (data.message.includes("Manager is not initated yet")) return;
		// this.logger.debug(data);
	}
}
