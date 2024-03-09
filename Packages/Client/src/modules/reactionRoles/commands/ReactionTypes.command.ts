import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { MaxArgsGuard } from "@/common/guards/Args/Max.guard";
import { MinArgsGuard } from "@/common/guards/Args/Min.guard";
import { EnableGuard } from "@/common/guards/Enable.guard";
import { OwnerPermissionGuard } from "@/common/guards/Permissions/Owner.Guard";
import { Extends } from "@/types/Constants";
import { IReactionRolesEmbeds, IReactionRolesService } from "@/types/Interfaces";
import { Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { CommandContext } from "../../commands/Commands.context";
import { ReactionRoles } from "../types/constants";

@Injectable()
export class ReactionTypesCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(Extends.ReactionRolesEmbeds) private readonly Embeds: IReactionRolesEmbeds,
	) {}

	private readonly logger = new Logger(ReactionTypesCommand.name);

	@LegacyCommand({
		name: "ReactionTypes",
		aliases: ["RTypes", "rtypes"],
		description: "Mostra os tipos de ReactionRoles",
		usage: "",
	})
	@SlashCommand({
		deployMode: "Test",
		type: "Sub",
		name: "types",
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
