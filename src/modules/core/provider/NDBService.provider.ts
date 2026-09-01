import type { Provider } from "@nestjs/common";
import { Services } from "#src/types/Constants.js";
import { NDBService } from "../NDB.service.js";

export const NDBServiceProvider: Provider<NDBService> = {
	provide: Services.NDB,
	useClass: NDBService,
};
