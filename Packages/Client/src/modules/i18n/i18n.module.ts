import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { Global, Inject, Module, OnModuleInit, Provider } from "@nestjs/common";
import { AcceptLanguageResolver, I18nLoader, I18nModule as _I18nModule } from "nestjs-i18n";
import { I18nService } from "./i18n.service";

const provider: Provider<I18nService> = {
	provide: Extends.Translate,
	useClass: I18nService,
};

@Global()
@Module({
	imports: [
		_I18nModule.forRootAsync({
			useFactory: async () => {
				return {
					fallbackLanguage: "pt-BR",
					disableMiddleware: false,
					loader: I18nLoader,
					logging: false,
					loaderOptions: {
						includeSubfolders: true,
						type: "json",
						path: "./src/common/Languages/i18n",
						watch: true,
					},
				};
			},
			resolvers: [AcceptLanguageResolver],
		}),
	],
	providers: [provider],
	exports: [provider],
})
export class I18nModule implements OnModuleInit {
	public constructor(@Inject(Extends.Translate) private readonly i18n: Ii18nService) {}

	public onModuleInit() {
		this.i18n.Logger();
	}
}
