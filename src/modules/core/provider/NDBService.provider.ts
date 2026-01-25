import type { Provider } from "@nestjs/common";
import { Services } from "@/types/Constants";
import { NDBService } from "../NDB.service";

export const NDBServiceProvider: Provider<NDBService> = {
	provide: Services.NDB,
	useClass: NDBService,
};
