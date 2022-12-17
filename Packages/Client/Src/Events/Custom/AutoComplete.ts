import NDBClient from "@Client/NDBClient"
import { BaseEvent } from "@Utils/Structures"
import { AutocompleteInteraction } from "discord.js"
import { EventOptions } from "~/Types"

export default class AutoCompleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "AutoComplete",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, interaction: AutocompleteInteraction) {
    if (interaction.commandName === "reactionrole") {
      const optionFocus = interaction.options.getFocused()
      const choices = ["all", "channel"]
      const filter = choices.filter(choice => choice.startsWith(optionFocus))
      await interaction.respond(
        filter.map(choice => ({ name: choice, value: choice }))
      )
    }
  }
}
