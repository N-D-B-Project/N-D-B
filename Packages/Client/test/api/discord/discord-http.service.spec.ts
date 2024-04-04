import { DiscordHttpService } from "@/modules/api/discord/discord-http.service";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("DiscordHttpService", () => {
	let service: DiscordHttpService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DiscordHttpService],
		}).compile();

		service = module.get<DiscordHttpService>(DiscordHttpService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
