import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import type { IReactionRolesEmbeds, IReactionRolesService } from "../interfaces";
import { ReactionRoles } from "../types/constants";
import { ReactionRolesCommand } from "../ReactionRoles.decorator";

@ReactionRolesCommand()
export class ReactionTypesCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
	) {}

	private readonly logger = new Logger(ReactionTypesCommand.name);

	@Subcommand({
		name: "types",
		description: "Show the types of ReactionRoles",
		nameLocalizations: localizationMapByKey("ReactionRoles.types.name"),
		descriptionLocalizations: localizationMapByKey("ReactionRoles.types.description"),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext) {}
}
