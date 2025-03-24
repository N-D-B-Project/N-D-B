export const discordConfig = {
	FallbackLocale: "pt-BR",
	Discord: {
		Client: {
			Owners: ["330047048009252864"],
		},
		Servers: {
			NDCommunity: "679066351456878633",
			TestGuild: "717094267243462688",
		},
	},
	EvalBadKeys: [
		"client.token",
		"client.destroy",
		"process.env.Token",
		"process.env.ClientSecret",
		"process.env.LavalinkHost",
		"process.env.LAVALINK_SERVER_PASSWORD",
		"process.env.SpotifyClientId",
		"process.env.SpotifyClientSecret",
	],
};
