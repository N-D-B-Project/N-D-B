import { inspect } from "node:util";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import type { Config } from "@/modules/config/types";
import {
	CurrentTranslate,
	type TranslationFn,
	localizationMapByKey,
} from "@necord/localization";
import { UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbedBuilder, codeBlock } from "discord.js";
import { Ctx, Options, type SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../../DeveloperTools.decorator";
import type { EvalDTO } from "./eval.dto";

@DeveloperToolsCommand()
export class EvalCommand {
	public constructor(private readonly config: ConfigService<Config>) {}
	private time: number;

	@Subcommand({
		name: "evaluate",
		description:
			"Evaluate some codes to test it without restart the bot every time",
		nameLocalizations: localizationMapByKey("DeveloperTools.eval.name"),
		descriptionLocalizations: localizationMapByKey(
			"DeveloperTools.eval.description",
		),
	})
	@CommandConfig({
		category: "🛠️ Developer Tools",
		disable: false,
	})
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		testOnly: true,
		ownerOnly: true,
	})
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@Options() { code }: EvalDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		try {
			if (
				this.config
					.getOrThrow<Config["EvalBadKeys"]>("EvalBadKeys")
					.some((key) => code.includes(key))
			) {
				return await interaction.reply({
					content: t("DeveloperTools.eval.BadKey"),
				});
			}
			const evalCode = await this.evaluate(code);
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(t("DeveloperTools.eval.Success"))
						.setColor("#00c26f")
						.setDescription(
							t("DeveloperTools.eval.Result", {
								input: codeBlock("TS", code),
								output: codeBlock("TS", evalCode),
								time: this.time,
							}),
						)
						.setTimestamp(),
				],
			});
		} catch (error) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(t("DeveloperTools.eval.Error"))
						.setColor("#c20e00")
						.setDescription(
							t("DeveloperTools.eval.Result", {
								input: codeBlock("TS", code),
								output: codeBlock("SH", error as string),
								time: this.time,
							}),
						),
				],
			});
		}
	}

	private async evaluate(code: string): Promise<string> {
		const start = process.hrtime();
		// biome-ignore lint/security/noGlobalEval: <explanation>
		const evalCode = inspect(await eval(code), {
			depth: 0,
		}).substring(0, 950);
		const stop = process.hrtime(start);
		this.time = stop[0] * 1e9 + stop[1] / 1e6;
		return evalCode;
	}
}
