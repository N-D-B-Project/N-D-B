import { I18nModule } from "@/modules/bot/i18n/i18n.module";
import { ReactionRolesService } from "@/modules/bot/reactionRoles/ReactionRoles.service";
import { ReactionRolesEmbedsProvider } from "@/modules/bot/reactionRoles/types/providers";
import { SharedModule } from "@/modules/shared/shared.module";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("ReactionRoleService", () => {
	let service: ReactionRolesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SharedModule, I18nModule],
			providers: [ReactionRolesService, ReactionRolesEmbedsProvider],
		}).compile();

		service = module.get<ReactionRolesService>(ReactionRolesService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
