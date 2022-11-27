import NDBClient from "@Client/NDBClient";
import {
  CommandInteraction,
  MessageComponentInteraction,
  DiscordAPIError,
  MessageOptions,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  Message,
  EmbedBuilder,
} from "discord.js";
import { IGNORED_ERRORS, MessageTools } from ".";

export default class InteractionTools {
  public static async deferReply(
    interaction: CommandInteraction | MessageComponentInteraction,
    ephemeral: boolean = false
  ): Promise<unknown> {
    try {
      return interaction.deferReply({
        ephemeral,
      });
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async deferUpdate(
    interaction: MessageComponentInteraction
  ): Promise<unknown> {
    try {
      return await interaction.deferUpdate();
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  /**
   * @method Reply or followUp(reply again) the interaction
   */

  public static async reply(
    interaction: CommandInteraction | MessageComponentInteraction,
    content: string | EmbedBuilder | MessageOptions,
    ephemeral: boolean = false
  ): Promise<Message> {
    try {
      let msgOptions = MessageTools.messageOptions(
        content
      ) as InteractionReplyOptions;

      if (interaction.deferred || interaction.replied) {
        return (await interaction.followUp({
          ...msgOptions,
          ephemeral,
        })) as Message;
      } else {
        return (await interaction.reply({
          ...msgOptions,
          ephemeral,
          fetchReply: true,
        })) as Message;
      }
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  /**
   * @method Edit the interaction
   */

  public static async editReply(
    interaction: CommandInteraction | MessageComponentInteraction,
    content: string | EmbedBuilder | MessageOptions
  ): Promise<Message> {
    try {
      let msgOptions = MessageTools.messageOptions(content);
      return (await interaction.editReply({
        ...msgOptions,
      })) as Message;
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async update(
    interaction: MessageComponentInteraction,
    content: string | EmbedBuilder | MessageOptions
  ): Promise<Message> {
    try {
      let msgOptions = MessageTools.messageOptions(
        content
      ) as InteractionUpdateOptions;
      return (await interaction.update({
        ...msgOptions,
        fetchReply: true,
      })) as Message;
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }
}
