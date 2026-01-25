import { localizationMapByKey } from "@necord/localization";
import { Inject } from "@nestjs/common";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../interfaces";
import { ReactionRolesCommand } from "../ReactionRoles.decorator";
import { ReactionRoles } from "../types/constants";

@ReactionRolesCommand()
export class ReactionTypesCommand {
	public constructor(
		@Inject(ReactionRoles.Service) readonly _reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) readonly _embeds: IReactionRolesEmbeds,
	) {}

	@Subcommand({
		name: "types",
		description: "Show the types of ReactionRoles",
		nameLocalizations: localizationMapByKey("ReactionRoles.types.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.types.description",
		),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		testOnly: true,
		ownerOnly: false,
	})
	public async onCommandRun(@Ctx() [_interaction]: SlashCommandContext) {}
}
