import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class UserDTO {
	@IsString()
	@IsNotEmpty()
	public username: string;

	@IsNumber()
	@IsNotEmpty()
	public id: string;

	@IsUrl()
	public avatar: string;

	@IsEmail()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	public accessToken: string;
}
