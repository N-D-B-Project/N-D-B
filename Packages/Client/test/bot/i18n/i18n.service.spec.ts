import { I18nService } from "@/modules/bot/i18n/i18n.service";
import { SharedModule } from "@/modules/shared/shared.module";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("I18nService", () => {
	let service: I18nService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SharedModule],
			providers: [I18nService],
		}).compile();

		service = module.get<I18nService>(I18nService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
