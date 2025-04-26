import { Embeds, Services } from "@/types";
import type { Provider } from "@nestjs/common";
import { ReactionRolesEmbeds } from "./ReactionRoles.embeds";
import { ReactionRolesService } from "./ReactionRoles.service";

export const ReactionRolesProvider: Provider<ReactionRolesService> = {
	provide: Services.ReactionRoles,
	useClass: ReactionRolesService,
};

export const ReactionRolesEmbedsProvider: Provider<ReactionRolesEmbeds> = {
	provide: Embeds.ReactionRoles,
	useClass: ReactionRolesEmbeds,
};
