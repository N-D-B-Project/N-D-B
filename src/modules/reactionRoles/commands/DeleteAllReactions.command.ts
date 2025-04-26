import { CommandConfig, CommandPermissions } from "@/common/decorators";
import {
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	Buttons,
	ConfirmButtonEnum,
} from "@/modules/components/Buttons.component";
import {
	Embeds,
	Extends,
	type IReactionRolesEmbeds,
	type IReactionRolesService,
	Services,
} from "@/types";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger } from "@nestjs/common";
import {
	ApplicationIntegrationType,
	type CommandInteraction,
	InteractionContextType,
} from "discord.js";
import {
	Button,
	type ButtonContext,
	ComponentParam,
	Ctx,
	type SlashCommandContext,
	Subcommand,
} from "necord";
import { InteractionTools } from "../../commands/Interaction";
import { ReactionRolesCommand } from "../ReactionRoles.decorator";

@ReactionRolesCommand()
export class DeleteAllReactionsCommand {
	public constructor(
		@Inject(Services.ReactionRoles)
		private readonly reaction: IReactionRolesService,
		@Inject(Embeds.ReactionRoles) private readonly embeds: IReactionRolesEmbeds,
		@Inject(Extends.Buttons) private readonly Buttons: Buttons,
	) {}

	private readonly logger = new Logger(DeleteAllReactionsCommand.name);
	private context: CommandInteraction;

	@Subcommand({
		name: "delete_all",
		description: "Delete all ReactionRoles in the server",
		nameLocalizations: localizationMapByKey("ReactionRoles.deleteall.name"),
		descriptionLocalizations: localizationMapByKey(
			"ReactionRoles.deleteall.description",
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
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext) {
		this.context = interaction;
		await interaction.reply({
			embeds: [
				await this.embeds.ReactionRoleDeleteAllEmbed(
					interaction,
					"Confirm",
					null,
				),
			],
			components: [await this.Buttons.Confirm(interaction.guildLocale)],
		});
	}

	@Button("confirm/:value")
	public async onButton(
		@Ctx() [interaction]: ButtonContext,
		@ComponentParam("value") value: ConfirmButtonEnum,
	) {
		const { count, status } = await this.reaction.DeleteAll(interaction.guild);
		switch (value) {
			case ConfirmButtonEnum.Yes:
				if (status === "Deleted") {
					InteractionTools.editReply(this.context, {
						embeds: [
							await this.embeds.ReactionRoleDeleteAllEmbed(
								this.context,
								"Success",
								count,
							),
						],
						components: [],
					});
				} else if (status === "UnableToDelete") {
					InteractionTools.editReply(this.context, {
						embeds: [
							await this.embeds.UnableToDeleteAllReactionRoleEmbed(
								this.context,
							),
						],
						components: [],
					});
				}
				break;

			case ConfirmButtonEnum.No:
				InteractionTools.editReply(this.context, {
					embeds: [
						await this.embeds.ReactionRoleDeleteAllEmbed(
							this.context,
							"Cancel",
							null,
						),
					],
					components: [],
				});
				break;
		}
	}
}
