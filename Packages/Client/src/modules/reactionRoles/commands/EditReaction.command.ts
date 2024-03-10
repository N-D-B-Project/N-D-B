import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { Buttons } from "@/modules/components/Buttons.component";
import { Extends } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, Message as DMessage, TextChannel } from "discord.js";
import { CommandContext, Context } from "../../commands/Commands.context";
import { IReactionRolesEmbeds, IReactionRolesService } from "../interfaces";
import { ReactionRoles } from "../types/constants";

@Injectable()
export class EditReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		@Inject(Extends.Buttons) private readonly Buttons: Buttons,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(EditReactionCommand.name);
	private context: Context;

	@LegacyCommand({
		name: "UpdateReaction",
		aliases: ["REdit", "reactionedit", "RUpdate"],
		description: "Edita uma Reaction Role",
		usage:
			"<Channel> <MessageId> <Role> <Emoji> <new option>\nDica Utilize o comando **ReactionTypes** para ver os parâmetros para (new option)",
	})
	@SlashCommand({
		deployMode: "Test",
		type: "Sub",
		name: "edit",
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
