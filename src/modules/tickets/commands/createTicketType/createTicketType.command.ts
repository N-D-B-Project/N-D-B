import { CommandConfig, CommandPermissions, ValidatedOptions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { TicketsService } from "../../tickets.service";
import { Tickets } from "../../types/constants";
import { TicketCommand } from "../tickets.decorator";
import { CreateTicketTypeDTO } from "./createTicketType.dto";

@TicketCommand()
export class CreateTicketTypeCommand {
	public constructor(@Inject(Tickets.Service) private readonly service: TicketsService) {}

	private readonly logger = new Logger(CreateTicketTypeCommand.name);

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
		@Ctx() [interaction]: SlashCommandContext,
		@ValidatedOptions() options: CreateTicketTypeDTO,
	) {
		this.service.createTicketType({ ...options, guildId: interaction.guildId });
	}
}
