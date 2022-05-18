import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";

export default class InteractionCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "interactionCreate",
      type: "once",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, interaction: Discord.Interaction) {
    const UserProfile = await client.Mongoose.FindUserProfile(
      interaction.member
    );
    if (!UserProfile) {
      await client.Mongoose.CreateUserProfile(interaction, interaction.user);
    }
    await client.Mongoose.AddGuildToProfile(interaction, interaction.user);

    if (interaction.isCommand()) {
      client.emit("SlashCommand", interaction, UserProfile);
      return;
    }

    if (interaction.isButton()) {
      client.emit("ButtonClick", interaction);
      return;
    }

    if (interaction.isSelectMenu()) {
      client.emit("SelectMenu", interaction);
      return;
    }

    if (interaction.isContextMenu) {
      client.emit("ContextMenu", interaction);
      return;
    }

    if (interaction.isAutocomplete) {
      client.emit("AutoComplete", interaction);
      return;
    }
  }
}
