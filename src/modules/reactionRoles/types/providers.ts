import type { Provider } from "@nestjs/common";
import { ReactionRolesEmbeds } from "../ReactionRoles.embeds.js";
import { ReactionRolesRepository } from "../ReactionRoles.repository.js";
import { ReactionRolesService } from "../ReactionRoles.service.js";
import { ReactionRoles } from "./constants.js";

export const ReactionRolesProvider: Provider<ReactionRolesService> = {
	provide: ReactionRoles.Service,
	useClass: ReactionRolesService,
};

export const ReactionRolesEmbedsProvider: Provider<ReactionRolesEmbeds> = {
	provide: ReactionRoles.Embeds,
	useClass: ReactionRolesEmbeds,
};

export const ReactionRolesRepoProvider: Provider<ReactionRolesRepository> = {
	provide: ReactionRoles.Repository,
	useClass: ReactionRolesRepository,
};
