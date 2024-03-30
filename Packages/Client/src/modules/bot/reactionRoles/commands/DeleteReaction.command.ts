import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { Buttons } from "@/modules/bot/components/Buttons.component";
import { Extends } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import { CommandContext, Context } from "../../commands/Commands.context";
import type { IReactionRolesEmbeds, IReactionRolesService } from "../interfaces";
import { ReactionRoles } from "../types/constants";

@Injectable()
export class DeleteReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
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
		deployMode: "Test",
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
		const MessageID = context.getArg("message", 1);
		const Message = await Channel.messages.fetch(MessageID);
		const Role = await context.getRole(this.client, "role", 2);
		const Emoji = context.getArg("emoji", 3);

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
