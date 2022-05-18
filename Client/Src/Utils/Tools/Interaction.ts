import NDBClient from "@Client/NDBClient";
import * as Discord from "discord.js";
import { IGNORED_ERRORS, MessageTools } from ".";

export default class InteractionTools {
  public static async deferReply(
    interaction:
      | Discord.CommandInteraction
      | Discord.MessageComponentInteraction,
    ephemeral: boolean = false
  ): Promise<void> {
    try {
      return interaction.deferReply({
        ephemeral,
      });
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async deferUpdate(
    interaction: Discord.MessageComponentInteraction
  ): Promise<void> {
    try {
      return await interaction.deferUpdate();
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
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
    interaction:
      | Discord.CommandInteraction
      | Discord.MessageComponentInteraction,
    content: string | Discord.MessageEmbed | Discord.MessageOptions,
    ephemeral: boolean = false
  ): Promise<Discord.Message> {
    try {
      let msgOptions = MessageTools.messageOptions(content);

      if (interaction.deferred || interaction.replied) {
        return (await interaction.followUp({
          ...msgOptions,
          ephemeral,
        })) as Discord.Message;
      } else {
        return (await interaction.reply({
          ...msgOptions,
          ephemeral,
          fetchReply: true,
        })) as Discord.Message;
      }
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
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
    interaction:
      | Discord.CommandInteraction
      | Discord.MessageComponentInteraction,
    content: string | Discord.MessageEmbed | Discord.MessageOptions
  ): Promise<Discord.Message> {
    try {
      let msgOptions = MessageTools.messageOptions(content);
      return (await interaction.editReply({
        ...msgOptions,
      })) as Discord.Message;
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async update(
    interaction: Discord.MessageComponentInteraction,
    content: string | Discord.MessageEmbed | Discord.MessageOptions
  ): Promise<Discord.Message> {
    try {
      let msgOptions = MessageTools.messageOptions(content);
      return (await interaction.update({
        ...msgOptions,
        fetchReply: true,
      })) as Discord.Message;
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }
}
