import { Injectable } from "@nestjs/common";
import {
	ChannelType,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	Client,
	GuildMember,
	PermissionResolvable,
} from "discord.js";
import { Context, type ContextOf, On } from "necord";

@Injectable()
export class VoiceStateUpdateEvents {
	public constructor(private readonly client: Client) {}

	@On("voiceChannelJoin")
	public async onVoiceChannelJoin(
		@Context() [member, channel]: ContextOf<"voiceChannelJoin">,
	) {
		if (
			this.checkMember(member) &&
			this.checkPermission(member, "DeafenMembers")
		) {
			await member.voice.setDeaf(true);
		}

		if (
			channel.type === ChannelType.GuildStageVoice &&
			this.checkPermission(member, "Speak")
		) {
			await member.voice.setSuppressed(false);
		}
	}

	// TODO: Auto leave if everyone leaves or is deafened
	@On("voiceChannelLeave")
	public async onVoiceChannelLeave(
		@Context() [member, channel]: ContextOf<"voiceChannelLeave">,
	) {
		if (this.checkMember(member) && !channel) {
		}
	}

	// TODO: Anti undeafen
	@On("voiceChannelUndeaf")
	public async onVoiceChannelUndeaf(
		@Context() [member, type]: ContextOf<"voiceChannelUndeaf">,
	) {
		if (this.checkMember(member)) {
			member.voice.setDeaf(true);
		}
	}

	private checkMember(member: GuildMember): boolean {
		return member.id === this.client.user?.id;
	}

	private checkPermission(
		member: GuildMember,
		permission: PermissionResolvable,
	): boolean {
		return member.permissions.has(permission);
	}
}
