import { localizationMapByKey } from "@necord/localization";
import { Inject, UseGuards } from "@nestjs/common";
import { Context, Options, type SlashCommandContext, Subcommand } from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
// biome-ignore lint/style/useImportType: dependency injection
import { TicketsService } from "../../tickets.service";
import { Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";
// biome-ignore lint/style/useImportType: dependency injection
import { CreateTicketTypeDTO } from "./createTicketType.dto";

@TicketCommand()
export class CreateTicketTypeCommand {
	public constructor(
		@Inject(Tickets.Service) private readonly service: TicketsService,
	) {}

	@Subcommand({
		name: "create_type",
		nameLocalizations: localizationMapByKey("Tickets.type.name"),
		description: "Create a type of ticket",
		descriptionLocalizations: localizationMapByKey("Tickets.type.description"),
	})
	@CommandConfig({ category: "🎫 Tickets", disable: false })
	@CommandPermissions({
		user: ["ManageGuild"],
		bot: ["ManageChannels"],
		guildOnly: false,
		ownerOnly: false,
		testOnly: true,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Context() [interaction]: SlashCommandContext,
		@Options() { description, emoji, message, name }: CreateTicketTypeDTO,
	) {
		this.service.createTicketType({
			description,
			emoji,
			message,
			name,
			guildId: interaction.guildId,
		});
	}
}
