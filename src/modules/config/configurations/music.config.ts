export const musicConfig = {
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
	URLList: {
		Youtube: "https://www.youtube.com",
		ShortYoutube: "https://youtu.be",
		SoundCloud: "https://soundcloud.com",
		Spotify: "https://open.spotify.com",
		Deezer: "https://www.deezer",
		Facebook: "https://facebook.com",
		Apple: "https://music.apple.com/",
		Twitch: "https://www.twitch.tv/",
	},
};
