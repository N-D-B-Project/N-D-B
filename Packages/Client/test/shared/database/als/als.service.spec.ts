import { AlsProvider } from "@/modules/shared/database/als/als.module";
import { AlsService } from "@/modules/shared/database/als/als.service";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("AlsService", () => {
	let service: AlsService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AlsService, AlsProvider],
		}).compile();

		service = module.get<AlsService>(AlsService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
