import { LegacyCommandOptions, SlashCommandOptions } from "@/modules/bot/commands/types";
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
	public context: Context;
	public SubList: Array<{ name: string }>;
	public Additional: IAdditional;

	public setContext(context: Context): this {
		this.context = context;
		return this;
	}

	public setSubList(SubList: Array<{ name: string }>): this {
		this.SubList = SubList;
		return this;
	}

	public setAdditional(Additional: IAdditional): this {
		this.Additional = Additional;
		return this;
	}
}
