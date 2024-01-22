import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Context, ContextOf, On } from "necord";

@Injectable()
export class MessageReactionEvents {
	public constructor(private readonly eventEmitter: EventEmitter2) {}

	@On("messageReactionAdd")
	public async onMessageReactionAdd(@Context() [reaction, user]: ContextOf<"messageReactionAdd">) {
		this.eventEmitter.emit("ReactionRoles.Add", reaction, user);
	}

	@On("messageReactionRemove")
	public async onMessageReactionRemove(@Context() [reaction, user]: ContextOf<"messageReactionRemove">) {
		this.eventEmitter.emit("ReactionRoles.Remove", reaction, user);
	}
}
