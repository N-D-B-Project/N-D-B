import { inspect } from "node:util";
import { CommandConfig, CommandPermissions, ValidatedOptions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { Config } from "@/modules/shared/config/types";
import { CurrentTranslate, TranslationFn, localizationMapByKey } from "@necord/localization";
import { UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbedBuilder, codeBlock } from "discord.js";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../../DeveloperTools.decorator";
import { EvalDTO } from "./eval.dto";

@DeveloperToolsCommand()
export class EvalCommand {
	public constructor(private readonly config: ConfigService<Config>) {}

	@Subcommand({
		name: "evaluate",
		description: "Evaluate some codes to test it without restart the bot every time",
		nameLocalizations: localizationMapByKey("DeveloperTools.eval.name"),
		descriptionLocalizations: localizationMapByKey("DeveloperTools.eval.description"),
	})
	@CommandConfig({
		category: "🛠️ Developer Tools",
		disable: true,
	})
	@CommandPermissions({
		user: [],
		bot: [],
		guildOnly: false,
		ownerOnly: true,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@ValidatedOptions() { code }: EvalDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		try {
			if (this.config.getOrThrow<Config["EvalBadKeys"]>("EvalBadKeys").some((key) => code.includes(key))) {
				return await interaction.reply({
					content: t("DeveloperTools.eval.BadKey"),
				});
			}

			// biome-ignore lint/security/noGlobalEval: <explanation>
			const evalCode = inspect(await eval(code), {
				depth: 0,
			}).substring(0, 950);
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(t("DeveloperTools.eval.Success"))
						.setColor("#00c26f")
						.setDescription(
							t("DeveloperTools.eval.Result", { input: codeBlock("TS", code), output: codeBlock("TS", evalCode) }),
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
							}),
						),
				],
			});
		}
	}
}
