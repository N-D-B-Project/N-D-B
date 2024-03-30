import { Services } from "@/types/Constants";
import { Provider } from "@nestjs/common";
import { NDBService } from "../NDB.service";

export const NDBServiceProvider: Provider = {
	provide: Services.NDB,
	useClass: NDBService,
};
