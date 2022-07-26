import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { BaseEvent } from "@Utils/Structures";
import {
  Interaction,
  CommandInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ContextMenuCommandInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { InteractionType } from "discord-api-types/v10";

export default class InteractionCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "interactionCreate",
      type: "once",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient, interaction: Interaction) {
    const UserProfile = await client.Mongoose.FindUserProfile(
      interaction.member
    );
    if (!UserProfile) {
      await client.Mongoose.CreateUserProfile(interaction, interaction.user);
    }
    await client.Mongoose.AddGuildToProfile(interaction, interaction.user);

    if (interaction.type === InteractionType.ApplicationCommand) {
      client.emit(
        "SlashCommand",
        interaction as CommandInteraction,
        UserProfile
      );
      return;
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      client.emit("AutoComplete", interaction as AutocompleteInteraction);
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

      if (interaction.isSelectMenu()) {
        client.emit("SelectMenu", interaction as SelectMenuInteraction);
        return;
      }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      client.emit("ModalSubmit", interaction as ModalSubmitInteraction);
    }
  }
}
