import { CommandOptions } from "@/types";
import { NecordBaseDiscovery } from "necord";
import { Context, IAdditional } from "./Commands.context";

export class CommandsDiscovery extends NecordBaseDiscovery<CommandOptions> {
  public override toJSON() {
    return this.meta;
  }
}

export class RunSubCommandEvent {
  context: Context;
  SubList: Array<{ name: string }>;
  Additional: IAdditional;
}
