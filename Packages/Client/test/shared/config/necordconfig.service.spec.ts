import { NecordConfigService } from "@/modules/shared/config/NecordConfig.service";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("NecordConfigService", () => {
	let service: NecordConfigService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [NecordConfigService],
		}).compile();

		service = module.get<NecordConfigService>(NecordConfigService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
