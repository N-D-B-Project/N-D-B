import type { Content } from "@/types";
import { messageOptions } from "@/utils/Tools";
import type {
	BaseMessageOptions,
	CommandInteraction,
	EmbedBuilder,
	InteractionReplyOptions,
	InteractionUpdateOptions,
	Message,
	MessageComponentInteraction,
} from "discord.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <Utility Class>
export class InteractionTools {
	public static async deferReply(
		interaction: CommandInteraction | MessageComponentInteraction,
		ephemeral = false,
	): Promise<unknown> {
		return interaction.deferReply({
			ephemeral,
		});
	}

	public static async deferUpdate(
		interaction: MessageComponentInteraction,
	): Promise<unknown> {
		return await interaction.deferUpdate();
	}

	/**
	 * @method Reply or followUp(reply again) the interaction
	 */

	public static async reply(
		interaction: CommandInteraction | MessageComponentInteraction,
		content: Content,
		ephemeral: boolean,
	): Promise<Message> {
		const msgOptions = messageOptions(content) as InteractionReplyOptions;

		if (interaction.deferred || interaction.replied) {
			return await interaction.followUp({
				...msgOptions,
				ephemeral,
			});
		}
		return await interaction.reply({
			...msgOptions,
			ephemeral,
			fetchReply: true,
		});
	}

	/**
	 * @method Edit the interaction
	 */

	public static async editReply(
		interaction: CommandInteraction | MessageComponentInteraction,
		content: string | EmbedBuilder | BaseMessageOptions,
	): Promise<Message> {
		const msgOptions = messageOptions(content);
		return await interaction.editReply({
			...msgOptions,
		});
	}

	public static async update(
		interaction: MessageComponentInteraction,
		content: string | EmbedBuilder | BaseMessageOptions,
	): Promise<Message> {
		const msgOptions = messageOptions(content) as InteractionUpdateOptions;
		return await interaction.update({
			...msgOptions,
			fetchReply: true,
		});
	}
}
