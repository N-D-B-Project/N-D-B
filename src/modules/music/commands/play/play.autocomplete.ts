import { Injectable } from "@nestjs/common";
import { AutocompleteInteraction, CacheType } from "discord.js";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class PlayAutoComplete extends AutocompleteInterceptor {
	public transformOptions(interaction: AutocompleteInteraction<CacheType>): void | Promise<void> {
		const focus = interaction.options.getFocused(true);

		return interaction.respond(
			["Youtube", "Youtube Music", "Spotify"]
				.filter((choice) => choice.startsWith(focus.value.toString()))
				.map((choice) => ({ name: choice, value: choice })),
		);
	}
}
