import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

class Client {
	@IsArray({
		message: "Owners must be a string array containing the bot owners user id.",
	})
	public readonly Owners: string[];
}

class Servers {
	@IsString({
		message:
			"NDCommunity must be a string containing the NDCommunity server id.",
	})
	public readonly NDCommunity: string;

	@IsString({
		message: "TestGuild must be a string containing the test guild server id.",
	})
	public readonly TestGuild: string;
}

class Discord {
	@ValidateNested()
	@Type(() => Client)
	public readonly Client: Client;

	@ValidateNested()
	@Type(() => Servers)
	public readonly Servers: Servers;
}

export class DiscordDTO {
	@IsString({
		message: "FallbackLocale must be a string containing the fallback locale.",
	})
	public readonly FallbackLocale: string;

	@ValidateNested()
	@Type(() => Discord)
	public readonly Discord: Discord;

	@IsArray({
		message:
			"EvalBadKeys must be a string array containing the bad keys for evaluation.",
	})
	public readonly EvalBadKeys: string[];
}
