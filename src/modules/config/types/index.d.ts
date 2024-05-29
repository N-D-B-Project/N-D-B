export type ENVIRONMENT = "DEVELOPMENT" | "PRODUCTION";

export interface Config {
	ENVIRONMENT: ENVIRONMENT;
	Database: {
		Version: string;
		URL: string;
		Name: string;
		Password: string;
		Redis: {
			Port: string;
			Host: string;
		};
	};
	API: {
		JwtSecret: string;
		JwtExpire: string;
		CookieSecret: string;
		MaxAge: number;
	};
	TopGGToken: string;
	FallbackLocale: string;
	Discord: {
		Token: string;
		DevToken: string;
		Client: {
			Owners: string[];
			Secret: string;
			ID: string;
			CallbackURL: string;
		};
		Servers: {
			NDCommunity: string;
			TestGuild: string;
		};
	};
	Debug: {
		Client: boolean;
		Shard: boolean;
		Translations: boolean;
		Lavalink: boolean;
		PremiumMusicPlayer: boolean;
	};
	Music: {
		Lavalink: boolean;
		Volumes: {
			Lavalink: number;
			Player: number;
		};
		Player: {
			AutoLeaveEmpty: {
				Channel: {
					Enable: boolean;
					Delay: number;
				};
				Queue: {
					Enable: boolean;
					Delay: number;
				};
			};
		};
		Client: {
			selfDeaf: boolean;
			serverDeaf: boolean;
		};
	};
	Emojis: {
		logo: string;
		fail: string;
		accept: string;
		success: string;
		thing: string;
		loading: string;
		loading2: string;
		delayping: string;
		Music: {
			Youtube: string;
			Spotify: string;
			SoundCloud: string;
			Deezer: string;
			Facebook: string;
			Apple: string;
			Twitch: string;
		};
	};
	URLList: {
		Music: {
			Youtube: string;
			ShortYoutube: string;
			SoundCloud: string;
			Spotify: string;
			Deezer: string;
			Facebook: string;
			Apple: string;
			Twitch: string;
		};
	};
	EvalBadKeys: string[];
}
