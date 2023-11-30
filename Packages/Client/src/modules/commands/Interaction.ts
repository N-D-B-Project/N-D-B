import { Content } from "@/types";
import {
  BaseMessageOptions,
  CommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  Message,
  MessageComponentInteraction
} from "discord.js";
import { CheckError, messageOptions } from "./Global";

export class InteractionTools {
  public static async deferReply(
    interaction: CommandInteraction | MessageComponentInteraction,
    ephemeral: boolean = false
  ): Promise<unknown> {
    try {
      return interaction.deferReply({
        ephemeral
      });
    } catch (error) {
      if (await CheckError(error)) {
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
      if (await CheckError(error)) {
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
    content: Content,
    ephemeral: boolean
  ): Promise<Message> {
    try {
      const msgOptions = messageOptions(content) as InteractionReplyOptions;

      if (interaction.deferred || interaction.replied) {
        return await interaction.followUp({
          ...msgOptions,
          ephemeral
        });
      } else {
        return await interaction.reply({
          ...msgOptions,
          ephemeral,
          fetchReply: true
        });
      }
    } catch (error) {
      if (await CheckError(error)) {
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
    content: string | EmbedBuilder | BaseMessageOptions
  ): Promise<Message> {
    try {
      const msgOptions = messageOptions(content);
      return (await interaction.editReply({
        ...msgOptions
      })) as Message;
    } catch (error) {
      if (await CheckError(error)) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async update(
    interaction: MessageComponentInteraction,
    content: string | EmbedBuilder | BaseMessageOptions
  ): Promise<Message> {
    try {
      const msgOptions = messageOptions(content) as InteractionUpdateOptions;
      return (await interaction.update({
        ...msgOptions,
        fetchReply: true
      })) as Message;
    } catch (error) {
      if (await CheckError(error)) {
        return;
      } else {
        throw error;
      }
    }
  }
}
