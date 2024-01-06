import { LegacyCommandOptions, SlashCommandOptions } from "@/types";
import { NecordBaseDiscovery } from "necord";
import { Context, IAdditional } from "./Commands.context";

export class LegacyCommandsDiscovery extends NecordBaseDiscovery<LegacyCommandOptions> {
	public override toJSON() {
		return this.meta;
	}
}

export class SlashCommandsDiscovery extends NecordBaseDiscovery<SlashCommandOptions> {
	public override toJSON() {
		return this.meta;
	}
}

export class RunSubCommandEvent {
	context: Context;
	SubList: Array<{ name: string }>;
	Additional: IAdditional;
}
