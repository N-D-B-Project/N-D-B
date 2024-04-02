import { Config, ENVIRONMENT } from "./types";

export const config = (): Config => ({
	ENVIRONMENT: process.env.ENVIRONMENT as ENVIRONMENT,
	Database: {
		Version: "Music",
		URL: process.env.DATABASE_URL,
		Name: process.env.DatabaseName,
		Password: process.env.DatabasePassword,
		Redis: {
			Port: process.env.RedisPort,
			Host: process.env.RedisHost,
		},
	},
	API: {
		JwtSecret: process.env.JWT_SECRET,
		JwtExpire: "1d",
		CookieSecret: process.env.COOKIE_SECRET,
		MaxAge: 86400, // 1 day in seconds
	},
	TopGGToken: process.env.TopGGToken,
	Discord: {
		Token: process.env.Token,
		DevToken: process.env.DevToken,
		Client: {
			Owners: ["330047048009252864"],
			Secret: process.env.ClientSecret,
			ID: "708822043420000366",
			CallbackURL: process.env.CallbackURL,
		},
		Servers: {
			NDCommunity: "679066351456878633",
			TestGuild: "717094267243462688",
		},
	},
	Debug: {
		Client: true,
		Translations: false,
		Lavalink: false,
		PremiumMusicPlayer: false,
	},
	Music: {
		Lavalink: true,
		Volumes: {
			Lavalink: 0.75,
			Player: 50,
		},
		Player: {
			AutoLeaveEmpty: {
				Channel: {
					Enable: true,
					Delay: 60000,
				},
				Queue: {
					Enable: true,
					Delay: 30000,
				},
			},
		},
		Client: {
			selfDeaf: true,
			serverDeaf: true,
		},
	},
	Emojis: {
		logo: "<:NDB:763741625079300117>",
		fail: "<:NotixDeny:719560576015138830>",
		accept: "<:NotixAllow:719560623960096789>",
		success: "<:NotixAllow:719560623960096789>",
		thing: "<a:OPensador:718195925327151134>",
		loading: "<a:Carregando:718196232757182566>",
		loading2: "<a:Carregando2:718196278646800424>",
		delayping: "<:DelayPing:718196166399098901>",
		Music: {
			Youtube: "<:youtube:730741995416453150>",
			Spotify: "<:Spotify:775154334832001044>",
			SoundCloud: "<:soundcloud:932065538014842950>",
			Deezer: "<:deezer:932065971336802334>",
			Facebook: "<:facebook:932066080996864070>",
			Apple: "<:Apple:852677662983716884>",
			Twitch: "<:twitch:998725252098052197>",
		},
	},
	URLList: {
		Music: {
			Youtube: "https://www.youtube.com",
			ShortYoutube: "https://youtu.be",
			SoundCloud: "https://soundcloud.com",
			Spotify: "https://open.spotify.com",
			Deezer: "https://www.deezer",
			Facebook: "https://facebook.com",
			Apple: "https://music.apple.com/",
			Twitch: "https://www.twitch.tv/",
		},
	},
	EvalBadKeys: [
		"client.token",
		"client.destroy",
		"process.env.Token",
		"process.env.DevToken",
		"process.env.DATABASE_URL",
		"process.env.DatabaseName",
		"process.env.DatabasePassword",
		"process.env.RedisPort",
		"process.env.RedisHost",
		"process.env.LavalinkHOST",
		"process.env.LavalinkPassword",
		"process.env.SpotifyClientId",
		"process.env.SpotifyClientSecret",
	],
});
