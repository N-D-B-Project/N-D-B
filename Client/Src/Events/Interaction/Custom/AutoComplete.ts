import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import { AutocompleteInteraction } from "discord.js";

export default class AutoCompleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "AutoComplete",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient) {}
}
