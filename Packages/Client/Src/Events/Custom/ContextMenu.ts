/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */

import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { ContextMenuCommandInteraction } from "discord.js";

export default class ContextMenuEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "ContextMenu",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, interaction: ContextMenuCommandInteraction) {}
}
