export class ConfigureTicketTypeDTO {
	public readonly name: string;
	public readonly guildId: string;
	public readonly supportRoleId?: string;
	public readonly categoryId?: string;
	public readonly description?: string;
	public readonly message?: string;
	public readonly emoji?: string;
}
