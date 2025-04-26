import { inspect } from "node:util";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@/modules/config";
import { Services } from "@/types/Constants";
import {
	CurrentTranslate,
	type TranslationFn,
	localizationMapByKey,
} from "@necord/localization";
import { Inject } from "@nestjs/common";
import {
	ApplicationIntegrationType,
	EmbedBuilder,
	InteractionContextType,
	codeBlock,
} from "discord.js";
import { Ctx, Options, type SlashCommandContext, Subcommand } from "necord";
import { DeveloperToolsCommand } from "../../DeveloperTools.decorator";
import type { EvalDTO } from "./eval.dto";

@DeveloperToolsCommand()
export class EvalCommand {
	public constructor(
		@Inject(Services.Config) private readonly configService: ConfigService,
	) {}
	private time: number;

	@Subcommand({
		name: "evaluate",
		description:
			"Evaluate some codes to test it without restart the bot every time",
		nameLocalizations: localizationMapByKey("DeveloperTools.eval.name"),
		descriptionLocalizations: localizationMapByKey(
			"DeveloperTools.eval.description",
		),
		integrationTypes: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
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
				this.configService.get("EvalBadKeys").some((key) => code.includes(key))
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
