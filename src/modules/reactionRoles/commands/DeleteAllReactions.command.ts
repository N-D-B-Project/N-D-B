import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { Buttons, ConfirmButtonEnum } from "@/modules/components/Buttons.component";
import { Extends } from "@/types/Constants";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { CommandInteraction } from "discord.js";
import { Button, ButtonContext, ComponentParam, Ctx, SlashCommandContext, Subcommand } from "necord";
import { InteractionTools } from "../../commands/Interaction";
import type { IReactionRolesEmbeds, IReactionRolesService } from "../interfaces";
import { ReactionRoles } from "../types/constants";
import { ReactionRolesCommand } from "../ReactionRoles.decorator";

@ReactionRolesCommand()
export class DeleteAllReactionsCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		@Inject(Extends.Buttons) private readonly Buttons: Buttons,
	) {}

	private readonly logger = new Logger(DeleteAllReactionsCommand.name);
	private context: CommandInteraction;

	@Subcommand({
		name: "delete_all",
		description: "Delete all ReactionRoles in the server",
		nameLocalizations: localizationMapByKey("ReactionRoles.deleteall.name"),
		descriptionLocalizations: localizationMapByKey("ReactionRoles.deleteall.description"),
	})
	@CommandConfig({ category: "🎩 ReactionRole", disable: false })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,testOnly: true,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext) {
		this.context = interaction;
		await interaction.reply({
			embeds: [await this.Embeds.ReactionRoleDeleteAllEmbed(interaction, "Confirm", null)],
			components: [await this.Buttons.Confirm(interaction.guildLocale)],
		});
	}

	@Button("confirm/:value")
	public async onButton(@Ctx() [interaction]: ButtonContext, @ComponentParam("value") value: ConfirmButtonEnum) {
		const { count, status } = await this.reaction.DeleteAll(interaction.guild);
		switch (value) {
			case ConfirmButtonEnum.Yes:
				if (status === "Deleted") {
					InteractionTools.editReply(this.context, {
						embeds: [await this.Embeds.ReactionRoleDeleteAllEmbed(this.context, "Success", count)],
						components: [],
					});
				} else if (status === "UnableToDelete") {
					InteractionTools.editReply(this.context, {
						embeds: [await this.Embeds.UnableToDeleteAllReactionRoleEmbed(this.context)],
						components: [],
					});
				}
				break;

			case ConfirmButtonEnum.No:
				InteractionTools.editReply(this.context, {
					embeds: [await this.Embeds.ReactionRoleDeleteAllEmbed(this.context, "Cancel", null)],
					components: [],
				});
				break;
		}
	}
}
