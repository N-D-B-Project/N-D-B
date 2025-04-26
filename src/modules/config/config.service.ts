import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: Cannot use import type in classes used in dependency injection
import { ConfigService as NestConfigService } from "@nestjs/config";
import type { DebugDTO, DiscordDTO, EmojisDTO, EnvDTO, MusicDTO } from "./dtos";

export type ConfigSchema = EnvDTO & DebugDTO & DiscordDTO & MusicDTO;
export type EmojisSchema = EmojisDTO;

@Injectable()
export class ConfigService {
	public constructor(
		private readonly nestConfigService: NestConfigService<
			ConfigSchema | EmojisSchema
		>,
	) {}

	public get<K extends keyof ConfigSchema>(value: K): ConfigSchema[K] {
		return this.nestConfigService.get<ConfigSchema[K]>(value);
	}

	public getEmoji<K extends keyof EmojisDTO>(value: K): EmojisDTO[K] {
		const emoji = this.nestConfigService.get<EmojisDTO[K]>(value);
		return `<:${value}:${emoji}>`;
	}
}
