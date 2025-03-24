import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsUrl, ValidateNested } from "class-validator";

export class Volumes {
	@IsNumber(
		{
			allowNaN: false,
			allowInfinity: false,
		},
		{
			message: "The Lavalink must be a number",
		},
	)
	public readonly Lavalink: number;

	@IsNumber(
		{
			allowNaN: false,
			allowInfinity: false,
		},
		{
			message: "The Player must be a number",
		},
	)
	public readonly Player: number;
}

export class Channel {
	@IsBoolean({
		message: "The Enable must be a boolean",
	})
	public readonly Enable: boolean;

	@IsNumber(
		{
			allowNaN: false,
			allowInfinity: false,
		},
		{
			message: "The Delay must be a number",
		},
	)
	public readonly Delay: number;
}

export class Queue {
	@IsBoolean({
		message: "The Enable must be a boolean",
	})
	public readonly Enable: boolean;

	@IsNumber(
		{
			allowNaN: false,
			allowInfinity: false,
		},
		{
			message: "The Delay must be a number",
		},
	)
	public readonly Delay: number;
}

export class AutoLeaveEmpty {
	@ValidateNested()
	@Type(() => Channel)
	public readonly Channel: Channel;

	@ValidateNested()
	@Type(() => Queue)
	public readonly Queue: Queue;
}

export class Player {
	@ValidateNested()
	@Type(() => AutoLeaveEmpty)
	public readonly AutoLeaveEmpty: AutoLeaveEmpty;
}

export class Client {
	@IsBoolean({
		message: "The selfDeaft must be a boolean",
	})
	public readonly selfDeaf: boolean;

	@IsBoolean({
		message: "The serverDeaf must be a boolean",
	})
	public readonly serverDeaf: boolean;
}

export class URLList {
	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The Youtube must be a valid URL",
		},
	)
	public readonly Youtube: string;

	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The ShortYoutube must be a valid URL",
		},
	)
	public readonly ShortYoutube: string;

	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The SoundCloud must be a valid URL",
		},
	)
	public readonly SoundCloud: string;

	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The Spotify must be a valid URL",
		},
	)
	public readonly Spotify: string;

	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The Deezer must be a valid URL",
		},
	)
	public readonly Deezer: string;

	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The Facebook must be a valid URL",
		},
	)
	public readonly Facebook: string;

	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The Apple must be a valid URL",
		},
	)
	public readonly Apple: string;

	@IsUrl(
		{
			protocols: ["https"],
		},
		{
			message: "The Twitch must be a valid URL",
		},
	)
	public readonly Twitch: string;
}

export class MusicDTO {
	@IsBoolean({
		message: "The Lavalink must be a boolean",
	})
	public readonly Lavalink: boolean;

	@ValidateNested()
	@Type(() => Volumes)
	public readonly Volumes: Volumes;

	@ValidateNested()
	@Type(() => Player)
	public readonly Player: Player;

	@ValidateNested()
	@Type(() => Client)
	public readonly Client: Client;

	@ValidateNested()
	@Type(() => URLList)
	public readonly URLList: URLList;
}
