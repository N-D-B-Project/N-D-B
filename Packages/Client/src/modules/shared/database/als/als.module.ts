import { AsyncLocalStorage } from "node:async_hooks";
import { Global, Module, Provider } from "@nestjs/common";
import { Repositories } from "../types/constants";
import { AlsService } from "./als.service";
import { AlsStore } from "./types";

export const AlsProvider: Provider<AsyncLocalStorage<AlsStore>> = {
	provide: Repositories.ALS,
	useValue: new AsyncLocalStorage<AlsStore>(),
};

@Global()
@Module({
	providers: [AlsService, AlsProvider],
	exports: [AlsProvider],
})
export class AlsModule {}
