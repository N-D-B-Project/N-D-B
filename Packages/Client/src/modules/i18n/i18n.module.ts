import { Extends } from "@/types/Constants";
import { Global, Inject, Module, OnModuleInit } from "@nestjs/common";
import { I18nLoader, I18nModule } from "nestjs-i18n";
import { i18nService } from "./i18n.service";

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
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
            watch: true
          }
        };
      }
    })
  ],
  providers: [
    {
      provide: Extends.Translate,
      useClass: i18nService
    }
  ]
})
export class i18nModule implements OnModuleInit {
  public constructor(
    @Inject(Extends.Translate) private readonly i18n: i18nService
  ) {}

  public onModuleInit() {
    this.i18n.Logger();
  }
}
