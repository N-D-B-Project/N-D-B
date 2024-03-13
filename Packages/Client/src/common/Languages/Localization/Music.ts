import { Localization } from "./types";

export const MusicLocalization: Localization = {
	name: {
		"en-US": "music",
		"pt-BR": "musica",
	},
	description: {
		"en-US": "Category 🎩 Music",
		"pt-BR": "Categoria 🎩 Music",
	},
	options: {
		play: {
			name: {
				"en-US": "play",
				"pt-BR": "tocar",
			},
			description: {
				"en-US": "Search for a Song or Playlist and play it in a voice channel",
				"pt-BR": "Pesquisa uma Musica ou Playlist e toca ela em um canal de voz",
			},
			options: {
				query: {
					name: {
						"en-US": "query",
						"pt-BR": "busca",
					},
					description: {
						"en-US": "<URL or Name> of the Music or Playlist",
						"pt-BR": "<URL ou Nome> da Musica ou Playlist",
					},
				},
			},
		},
		nowplaying: {
			name: {
				"en-US": "now_playing",
				"pt-BR": "tocando_agora",
			},
			description: {
				"en-US": "Shows what song is playing and more information",
				"pt-BR": "Mostra qual musica está tocando e mais informações",
			},
		},
		join: {
			name: {
				"en-US": "join",
				"pt-BR": "entrar",
			},
			description: {
				"en-US": "Makes the bot join your voice channel and creates a player",
				"pt-BR": "Faz o bot entrar no seu canal de voz e cria um player",
			},
		},
		leave: {
			name: {
				"en-US": "leave",
				"pt-BR": "sair",
			},
			description: {
				"en-US": "Leave the voice channel",
				"pt-BR": "Sair da chamada de voz",
			},
		},
		pause: {
			name: {
				"en-US": "pause",
				"pt-BR": "pausar",
			},
			description: {
				"en-US": "Pauses the music queue",
				"pt-BR": "Pausa a fila de musicas",
			},
		},
		resume: {
			name: {
				"en-US": "resume",
				"pt-BR": "resumir",
			},
			description: {
				"en-US": "Resumes the music queue",
				"pt-BR": "resume a fila de musicas",
			},
		},
		stop: {
			name: {
				"en-US": "stop",
				"pt-BR": "parar",
			},
			description: {
				"en-US": "Stops the music queue",
				"pt-BR": "Para a fila de musicas",
			},
		},
	},
};
