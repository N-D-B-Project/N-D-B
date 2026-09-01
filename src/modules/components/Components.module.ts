import { Global, Module, type Provider } from "@nestjs/common";
import { Extends } from "#src/types/Constants.js";
import { Buttons } from "./Buttons.component.js";

const provider: Provider<Buttons> = {
	provide: Extends.Buttons,
	useClass: Buttons,
};

@Global()
@Module({
	providers: [provider],
	exports: [provider],
})
export class ComponentsModule {}
