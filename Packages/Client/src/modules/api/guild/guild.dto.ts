import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class GuildDTO {
	@IsNumber()
	@IsNotEmpty()
	public id: string;

	@IsString()
	@IsNotEmpty()
	public name: string;

	@IsUrl()
	public icon: string;

	@IsBoolean()
	public owner: boolean;

	@IsString()
	@IsNotEmpty()
	public permissions: string;

	@IsArray()
	public features: string[];
}
