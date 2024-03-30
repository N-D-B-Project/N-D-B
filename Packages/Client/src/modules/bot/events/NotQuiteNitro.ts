import type { Ii18nService } from "@/modules/bot/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Client, Message, TextChannel } from "discord.js";

@Injectable()
export class NotQuiteNitroEvent {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly client: Client,
	) {}

	@OnEvent("NotQuiteNitro")
	public async onNQN(message: Message, emojis: RegExpMatchArray) {
		let replyContent = message.content;
		for (const _emoji of emojis) {
			const emoji = this.client.emojis.cache.find((e) => e.name === _emoji);
			if (!emoji) return;
			if (new RegExp(emoji.toString(), "g").test(replyContent)) {
				replyContent = message.content.replace(new RegExp(emoji.toString(), "g"), emoji.toString());
			} else {
				replyContent = message.content.replace(new RegExp(`:${_emoji}:`, "g"), emoji.toString());
			}

			const webhook = (await (message.channel as TextChannel).fetchWebhooks()).find((w) => w.name === "N-D-B_NQN");
			if (!webhook) {
				await (message.channel as TextChannel).createWebhook({
					reason: await this.Translate.Guild(message, "Events/MessageCreate:NQNCreationReason", {
						Username: message.author.username,
						UserId: message.author.id,
					}),
					name: "N-D-B_NQN",
					avatar: this.client.user.displayAvatarURL(),
				});
			}
			await webhook.edit({
				name: message.member.nickname ? message.member.nickname : message.author.username,
				avatar: message.author.displayAvatarURL(),
			});

			message.delete();
			webhook.send(replyContent);

			await webhook.edit({
				name: "N-D-B_NQN",
				avatar: this.client.user.displayAvatarURL(),
			});
		}
	}
}
