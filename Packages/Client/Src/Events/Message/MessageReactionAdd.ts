import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageReaction, User } from "discord.js";

export default class MessageReactionAddEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageReactionAdd",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, reaction: MessageReaction, user: User) {
    client.emit("ReactionRoleAdd", reaction, user);
  }
}
