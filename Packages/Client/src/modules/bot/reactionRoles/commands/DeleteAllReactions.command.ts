import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { Buttons, ConfirmButtonEnum } from "@/modules/bot/components/Buttons.component";
import { Extends } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Button, ButtonContext, ComponentParam, Context as NecordContext } from "necord";
import { CommandContext, Context } from "../../commands/Commands.context";
import type { IReactionRolesEmbeds, IReactionRolesService } from "../interfaces";
import { ReactionRoles } from "../types/constants";

@Injectable()
export class DeleteAllReactionsCommand {
	public constructor(
		@Inject(ReactionRoles.Service) private readonly reaction: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly Embeds: IReactionRolesEmbeds,
		@Inject(Extends.Buttons) private readonly Buttons: Buttons,
	) {}

	private readonly logger = new Logger(DeleteAllReactionsCommand.name);
	private context: Context;

	@LegacyCommand({
		name: "DeleteAllReactions",
		description: "Remove todas as Reaction Roles do Servidor",
		usage: "",
	})
	@SlashCommand({
		deployMode: "Test",
		type: "Sub",
		name: "delete_all",
	})
	@CommandConfig({ category: "🎩 ReactionRole" })
	@CommandPermissions({
		user: ["SendMessages", "AddReactions", "ManageRoles"],
		bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext) {
		this.context = context;
		await context.send({
			embeds: [await this.Embeds.ReactionRoleDeleteAllEmbed(context, "Confirm", null)],
			components: [await this.Buttons.Confirm(context)],
		});
	}

	@Button("confirm/:value")
	public async onButton(
		@NecordContext() [interaction]: ButtonContext,
		@ComponentParam("value") value: ConfirmButtonEnum,
	) {
		const { count, status } = await this.reaction.DeleteAll(this.context.guild);
		switch (value) {
			case ConfirmButtonEnum.Yes:
				if (status === "Deleted") {
					this.context.edit({
						embeds: [await this.Embeds.ReactionRoleDeleteAllEmbed(this.context, "Success", count)],
						components: [],
					});
				} else if (status === "UnableToDelete") {
					this.context.edit({
						embeds: [await this.Embeds.UnableToDeleteAllReactionRoleEmbed(this.context)],
						components: [],
					});
				}
				break;

			case ConfirmButtonEnum.No:
				this.context.edit({
					embeds: [await this.Embeds.ReactionRoleDeleteAllEmbed(this.context, "Cancel", null)],
					components: [],
				});
				break;
		}
	}
}
