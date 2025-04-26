import { Services } from "@/types";
import type { Provider } from "@nestjs/common";
import { NDBService } from "../NDB.service";

export const NDBServiceProvider: Provider<NDBService> = {
	provide: Services.NDB,
	useClass: NDBService,
};
