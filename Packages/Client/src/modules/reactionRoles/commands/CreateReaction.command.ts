import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators/";
import { MaxArgsGuard } from "@/common/guards/Args/Max.guard";
import { MinArgsGuard } from "@/common/guards/Args/Min.guard";
import { EnableGuard } from "@/common/guards/Enable.guard";
import { OwnerPermissionGuard } from "@/common/guards/Permissions/Owner.Guard";
import { iReaction } from "@/types";
import { Extends } from "@/types/Constants";
import { IReactionRolesEmbeds, IReactionRolesService } from "@/types/Interfaces";
import { Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { Message as DMessage, TextChannel } from "discord.js";
import { CommandContext } from "../../commands/Commands.context";
import { ReactionRoles } from "../types/constants";

@Injectable()
export class CreateReactionCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(Extends.ReactionRolesEmbeds) private readonly Embeds: IReactionRolesEmbeds,
	) {}

	private readonly logger = new Logger(CreateReactionCommand.name);

	@LegacyCommand({
		name: "CreateReaction",
		aliases: ["CReaction", "AddReaction", "createreaction", "creaction", "ReactionCreate"],
		description: "Cria um novo Reaction Role no servidor.",
		usage:
			"<Canal> <MessageID> <Cargo> <Emoji> (opção)\nDica Utilize o comando **ReactionTypes** para ver os parâmetros para (option)",
		args: {
			min: 4,
			max: 5,
		},
	})
	@SlashCommand({
		deployMode: "Test",
		type: "Sub",
		name: "create",
	})
	@CommandConfig({ category: "🎩 ReactionRole" })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(EnableGuard, OwnerPermissionGuard, MinArgsGuard, MaxArgsGuard)
	public async onCommandRun([client, context]: CommandContext) {
		const Channel = (await context.getChannel(client, "channel", 0)) as TextChannel;
		const MessageID = context.getArg("message", 1) as string;
		const Message = (await Channel.messages.fetch(MessageID)) as DMessage;
		const Role = await context.getRole(client, "role", 2);
		const Emoji = context.getArg("emoji", 3) as string;
		let Option = Number(context.getArg("type", 4));
		if (!Option || Option > 6 || Number.isNaN(Option)) Option = 1;

		await this.reaction.CheckParams(client, context, Channel, MessageID, Message, Role, Emoji);

		const data: iReaction = {
			Channel: Channel.id,
			Message: Message.id,
			Role: Role.id,
			Emoji,
			Option,
		};
		const Created = await this.reaction.Create(context.guild, data);

		if (Created.status === "Created") {
			await context.react(Message, Emoji);
			return await context.send(await this.Embeds.ReactionRoleCreatedEmbed(context, data));
		}
		return await context.send(await this.Embeds.UnableToCreateReactionRoleEmbed(context));
	}
}
