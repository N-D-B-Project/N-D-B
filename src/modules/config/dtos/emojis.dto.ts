import { IsString } from "class-validator";

export class EmojisDTO {
	@IsString({
		message: "logo must be a string value",
	})
	public readonly logo: string;

	@IsString({
		message: "fail must be a string value",
	})
	public readonly fail: string;

	@IsString({
		message: "success must be a string value",
	})
	public readonly success: string;

	@IsString({
		message: "loading must be a string value",
	})
	public readonly loading: string;

	@IsString({
		message: "loading2 must be a string value",
	})
	public readonly loading2: string;

	@IsString({
		message: "youtube must be a string value",
	})
	public readonly youtube: string;

	@IsString({
		message: "spotify must be a string value",
	})
	public readonly spotify: string;
}
