import { Injectable } from "@nestjs/common";
import { AutocompleteInteraction } from "discord.js";
import { DefaultSources } from "lavalink-client";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class PlayAutocompleteInterceptor extends AutocompleteInterceptor {
	public transformOptions(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true);
		let choices: { name: string; value: string }[] = [];

		if (focused.name === "source") {
			choices = [
				{ name: "Youtube", value: DefaultSources.youtube },
				{ name: "Spotify", value: DefaultSources.spotify },
			];
		}
		return interaction.respond(
			choices
				.filter((choice) => choice.name.startsWith(focused.value.toString()))
				.map((choice) => ({ name: choice.name, value: choice.value })),
		);
	}
}
