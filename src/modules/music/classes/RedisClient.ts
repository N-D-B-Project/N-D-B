import { Redis } from "ioredis";

export class RedisClient extends Redis {
	public constructor() {
		super({
			port: Number(process.env.RedisPort),
			host: process.env.RedisHost,
		});
	}
}
