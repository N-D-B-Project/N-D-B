import { DiscordHttpService } from "@/modules/api/discord/discord-http.service";
import { DiscordService } from "@/modules/api/discord/discord.service";
import { Services } from "@/types/Constants";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("DiscordService", () => {
	let service: DiscordService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DiscordService,
				{
					provide: Services.Discord_HTTP,
					useClass: DiscordHttpService,
				},
			],
		}).compile();

		service = module.get<DiscordService>(DiscordService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
