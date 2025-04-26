import { Type } from "class-transformer";
import { IsBoolean, ValidateNested } from "class-validator";

class DebugConfig {
	@IsBoolean({
		message: "Client must be a boolean value",
	})
	public readonly Client!: boolean;

	@IsBoolean({
		message: "Shard must be a boolean value",
	})
	public readonly Shard!: boolean;

	@IsBoolean({
		message: "Translations must be a boolean value",
	})
	public readonly Translations!: boolean;

	@IsBoolean({
		message: "Lavalink must be a boolean value",
	})
	public readonly Lavalink!: boolean;

	@IsBoolean({
		message: "PremiumMusicPlayer must be a boolean value",
	})
	public readonly PremiumMusicPlayer!: boolean;
}

export class DebugDTO {
	@ValidateNested()
	@Type(() => DebugConfig)
	public readonly Debug!: DebugConfig;
}
