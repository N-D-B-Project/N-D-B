import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { InteractionType } from "discord-api-types/v10";
import {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Interaction,
  ModalSubmitInteraction
} from "discord.js";

export default class InteractionCreateEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "interactionCreate",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, interaction: Interaction) {
    if (interaction.type === InteractionType.ApplicationCommand) {
      return client.emit(
        "SlashCommand",
        interaction as ChatInputCommandInteraction
      );
    }

    if (interaction.type === InteractionType.MessageComponent) {
      if (interaction.isButton()) {
        return client.emit("ButtonClick", interaction as ButtonInteraction);
      }

      if (interaction.isContextMenuCommand()) {
        return client.emit(
          "ContextMenu",
          interaction as ContextMenuCommandInteraction
        );
      }

      if (interaction.isAnySelectMenu()) {
        return client.emit(
          "SelectMenu",
          interaction as AnySelectMenuInteraction
        );
      }
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      return client.emit(
        "AutoComplete",
        interaction as AutocompleteInteraction
      );
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      return client.emit("ModalSubmit", interaction as ModalSubmitInteraction);
    }
  }
}
