import { NDBService } from "@/modules/bot/core/NDB.service";
import { I18nModule } from "@/modules/bot/i18n/i18n.module";
import { SharedModule } from "@/modules/shared/shared.module";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("NDBService", () => {
	let service: NDBService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [I18nModule, SharedModule],
			providers: [NDBService],
		}).compile();

		service = module.get<NDBService>(NDBService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
