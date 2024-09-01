import { Injectable } from "@nestjs/common";
import { Context, ContextOf, On } from "necord";

@Injectable()
export class NDCEvents {
	private readonly ids = [
		"1109727237919486012",
		"1109727252943474698",
		"1109727267791323248",
		"1109727514789683262",
		"1109727527980777472",
		"1109727289316479098",
		"1109727306311807076",
		"1109727613062221854",
		"1109727542916689970",
		"1109727567285583962",
	];

	@On("messageCreate")
	public onMessageCreate(@Context() [message]: ContextOf<"messageCreate">) {
		if (!this.checkGuild(message.guildId)) return;
		if (message.deletable && this.ids.includes(message.channelId)) {
			message.delete();
		}
	}

	@On("voiceChannelJoin")
	public onVoiceChannelJoin(
		@Context() [member, channel]: ContextOf<"voiceChannelJoin">,
	) {
		if (!this.checkGuild(channel.guildId)) return;
		if (this.ids.includes(channel.id)) {
			member.voice.disconnect(
				`User entered in Placeholder channel: ${channel.name}`,
			);
		}
	}

	private checkGuild(guildId: string): boolean {
		return guildId === "679066351456878633";
	}
}
