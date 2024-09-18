import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger } from "@nestjs/common";
import { ApplicationIntegrationType, InteractionContextType } from "discord.js";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { ReactionRolesCommand } from "../ReactionRoles.decorator";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../interfaces";
import { ReactionRoles } from "../types/constants";

@ReactionRolesCommand()
export class ReactionTypesCommand {
	public constructor(
		@Inject(ReactionRoles.Service)
		private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
	) {}

	private readonly logger = new Logger(ReactionTypesCommand.name);

	@Subcommand({
		name: "types",
		description: "Show the types of ReactionRoles",
		nameLocalizations: localizationMapByKey("ReactionRoles.types.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.types.description",
		),
		integrationTypes: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		testOnly: true,
		ownerOnly: false,
	})
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext) {}
}
