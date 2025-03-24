import {
	IsArray,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";

export class EnvDTO {
	@IsString()
	public readonly NODE_ENV: "development" | "production";

	@IsString({
		message: "Token must be a string",
	})
	public readonly Token: string;

	@IsString()
	@IsOptional()
	public readonly TopGGToken?: string;

	@IsString({
		message: "ClientSecret must be a string",
	})
	public readonly ClientSecret: string;

	@IsString({
		message: "ClientId must be a string",
	})
	public readonly ClientId: string;

	@IsString({
		message: "DATABASE_URL must be a string",
	})
	public readonly DATABASE_URL: string;

	@IsString({
		message: "LavalinkHost must be a string",
	})
	public readonly LavalinkHost: string;

	@IsString({
		message: "LAVALINK_SERVER_PASSWORD must be a string",
	})
	public readonly LAVALINK_SERVER_PASSWORD: string;

	@IsNumber(
		{
			allowInfinity: false,
			allowNaN: false,
		},
		{
			message: "LavalinkPort must be a number",
		},
	)
	public readonly LavalinkPort: number;

	@IsString({
		message: "SpotifyClientId must be a string",
	})
	public readonly SpotifyClientId: string;

	@IsString({
		message: "SpotifyClientSecret must be a string",
	})
	public readonly SpotifyClientSecret: string;

	@IsNumber(
		{
			allowInfinity: false,
			allowNaN: false,
		},
		{
			message: "PORT must be a number",
		},
	)
	public readonly PORT: number;
}
