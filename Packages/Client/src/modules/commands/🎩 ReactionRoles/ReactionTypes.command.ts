import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { MaxArgsGuard } from "@/common/guards/Args/Max.guard";
import { MinArgsGuard } from "@/common/guards/Args/Min.guard";
import { EnableGuard } from "@/common/guards/Enable.guard";
import { OwnerPermissionGuard } from "@/common/guards/Permissions/Owner.Guard";
import { Extends, Services } from "@/types/Constants";
import { IReactionRolesEmbeds, IReactionRolesService } from "@/types/Interfaces";
import { Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { CommandContext } from "../Commands.context";

@Injectable()
export class ReactionTypesCommand {
	public constructor(
		@Inject(Services.ReactionRoles) private readonly reaction: IReactionRolesService,
		@Inject(Extends.ReactionRolesEmbeds) private readonly Embeds: IReactionRolesEmbeds,
	) {}

	private readonly logger = new Logger(ReactionTypesCommand.name);

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
	public async onCommandRun([client, context]: CommandContext) {}
}
