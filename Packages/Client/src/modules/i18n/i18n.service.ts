import { Config, TranslateInfo } from "@/types";
import { Services } from "@/types/Constants";
import { IDatabaseService, Ii18nService } from "@/types/Interfaces";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "discord.js";
import { I18nService } from "nestjs-i18n";
import { Context } from "../commands/Commands.context";

@Injectable()
export class i18nService implements Ii18nService {
	private logger = new Logger(i18nService.name);
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		private readonly i18n: I18nService,
	) {}

	public Logger(): void {
		const languages = this.i18n.getSupportedLanguages();
		const namespaces = this.i18n.getTranslations();
		this.logger.log(`${languages.length} linguagens foram carregadas com sucesso! (${languages.join(" | ")})`);
		if (this.database.ConfigRepo().getOrThrow<Config["Debug"]>("Debug").Translations) this.logger.debug(namespaces);
	}

	public async Guild(info: TranslateInfo, key: string, args?: unknown): Promise<string> {
		const lang = (await this.database.GuildRepo().get(info.guild.id)).Settings.Language;
		return this.i18n.translate(this.fixKey(key), { args, lang });
	}

	public async DM(key: string, user: User, args?: Record<string, unknown>): Promise<string> {
		const lang = (await this.database.UserRepo().get(user.id)).Settings.Language;
		return this.i18n.translate(this.fixKey(key), { args, lang });
	}

	public async TFunction(context: Context, key: string, args?: Record<string, unknown>): Promise<string> {
		if (context.isDM || (context.isSub && context.isDM)) {
			return await this.DM(key, context.author, args);
		}

		if (context.isSlash) {
			return await this.Guild(context.interaction, key, args);
		}
		return await this.Guild(context.message, key, args);
	}

	private fixKey(target: string): string {
		return target.replace(/[\/:]/g, ".");
	}
}