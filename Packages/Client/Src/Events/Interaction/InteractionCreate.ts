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
      client.emit("SlashCommand", interaction as ChatInputCommandInteraction);
      return;
    }

    if (interaction.type === InteractionType.MessageComponent) {
      if (interaction.isButton()) {
        client.emit("ButtonClick", interaction as ButtonInteraction);
        return;
      }

      if (interaction.isContextMenuCommand()) {
        client.emit(
          "ContextMenu",
          interaction as ContextMenuCommandInteraction
        );
        return;
      }

      if (interaction.isAnySelectMenu()) {
        client.emit("SelectMenu", interaction as AnySelectMenuInteraction);
        return;
      }
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      client.emit("AutoComplete", interaction as AutocompleteInteraction);
      return;
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      client.emit("ModalSubmit", interaction as ModalSubmitInteraction);
    }
  }
}
