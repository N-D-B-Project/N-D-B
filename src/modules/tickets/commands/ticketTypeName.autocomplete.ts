import { Inject, Injectable } from "@nestjs/common";
import type { AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";
import type { ITicketsService } from "../interfaces";
import { Tickets } from "../types/constants";

@Injectable()
export class TicketTypeNameAutocomplete extends AutocompleteInterceptor {
	public constructor(
		@Inject(Tickets.Service) private readonly service: ITicketsService,
	) {
		super();
	}

	public async transformOptions(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true);

		if (focused.name === "name") {
			const ticketTypes = await this.service.getTicketTypes(
				interaction.guildId,
			);

			const filtered = ticketTypes
				.filter((type) =>
					type.name.toLowerCase().includes(focused.value.toLowerCase()),
				)
				.slice(0, 25)
				.map((type) => ({
					name: type.name,
					value: type.name,
				}));

			return interaction.respond(filtered);
		}

		return interaction.respond([]);
	}
}
