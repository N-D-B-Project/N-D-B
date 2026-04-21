import {
	type LavalinkManagerContextOf,
	OnLavalinkManager,
} from "@necord/lavalink";
import { Injectable } from "@nestjs/common";
import { Context } from "necord";

@Injectable()
export class LavalinkDebugEvents {
	@OnLavalinkManager("debug")
	public onDebug(@Context() [_key, data]: LavalinkManagerContextOf<"debug">) {
		if (data.message.includes("Manager is not initated yet")) return;
	}
}
