import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { Buttons } from "@/modules/components/Buttons.component";
import { Extends, Services } from "@/types/Constants";
import { IReactionRolesEmbeds, IReactionRolesService } from "@/types/Interfaces";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, Message as DMessage, TextChannel } from "discord.js";
import { CommandContext, Context } from "../Commands.context";

@Injectable()
export class DeleteReactionCommand {
	public constructor(
		@Inject(Services.ReactionRoles) private readonly reaction: IReactionRolesService,
		@Inject(Extends.ReactionRolesEmbeds) private readonly Embeds: IReactionRolesEmbeds,
		@Inject(Extends.Buttons) private readonly Buttons: Buttons,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(DeleteReactionCommand.name);
	private context: Context;

	@LegacyCommand({
		name: "DeleteReaction",
		aliases: ["DReaction", "RemoveReaction", "removereaction", "dreaction", "rreaction", "ReactionDelete"],
		description: "Deleta uma Reaction Role existente",
		usage: "<Canal> <MessageID> <Cargo> <Emoji>",
		args: {
			min: 4,
			max: 4,
		},
	})
	@SlashCommand({
		type: "Sub",
		name: "delete",
	})
	@CommandConfig({ category: "🎩 ReactionRole" })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext) {
		const Channel = (await context.getChannel(this.client, "channel", 0)) as TextChannel;
		const MessageID = context.getArg("message", 1) as string;
		const Message = (await Channel.messages.fetch(MessageID)) as DMessage;
		const Role = await context.getRole(this.client, "role", 2);
		const Emoji = context.getArg("emoji", 3) as string;

		await this.reaction.CheckParams(client, context, Channel, MessageID, Message, Role, Emoji);

		const REACT = await this.reaction.Delete(context.guild, {
			Channel: Channel.id,
			Message: Message.id,
			Role: Role.id,
			Emoji,
		});

		if (REACT.status === "Deleted") {
			await context.send(await this.Embeds.ReactionRoleRemovedEmbed(context, Message));
			await Message.reactions.cache.get(Emoji).remove();
		} else {
			context.send(await this.Embeds.UnableToDeleteReactionRoleEmbed(context, Message));
		}
	}
}
