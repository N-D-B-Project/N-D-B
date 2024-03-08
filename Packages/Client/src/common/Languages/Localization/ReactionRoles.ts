import { Localization } from "@/types";

export const ReactionRolesLocalization: Localization = {
	name: {
		"en-US": "reaction_roles",
		"pt-BR": "cargos_por_reacao",
	},
	description: {
		"en-US": "Category 🎩 ReactionRoles",
		"pt-BR": "Categoria 🎩 ReactionRoles",
	},
	options: {
		create: {
			name: {
				"en-US": "create",
				"pt-BR": "criar",
			},
			description: {
				"en-US": "Create an ReactionRole in the server",
				"pt-BR": "Cria uma ReactionRole no servidor",
			},
			options: {
				channel: {
					name: { "en-US": "channel", "pt-BR": "canal" },
					description: {
						"en-US": "Channel where the ReactionRole will be created",
						"pt-BR": "Canal onde será criado o ReactionRole",
					},
				},
				message: {
					name: { "en-US": "message", "pt-BR": "mensagem" },
					description: {
						"en-US": "Message ID that the member will react",
						"pt-BR": "ID da Mensagem no qual o membro reagi-rá",
					},
				},
				role: {
					name: { "en-US": "role", "pt-BR": "cargo" },
					description: { "en-US": "Role to be used in ReactionRole", "pt-BR": "Cargo a ser usado na ReactionRole" },
				},
				emoji: {
					name: { "en-US": "emoji", "pt-BR": "emoji" },
					description: { "en-US": "Emoji that the user will react", "pt-BR": "Emoji no qual o membro reagi-rá" },
				},
				type: {
					name: { "en-US": "type", "pt-BR": "tipo" },
					description: {
						"en-US": "Type of ReactionRole (1-6) (/reaction_role types)",
						"pt-BR": "Tipo de ReactionRole (1-6) (/cargos_por_reacao tipos)",
					},
				},
			},
		},
		delete: {
			name: {
				"en-US": "delete",
				"pt-BR": "deletar",
			},
			description: {
				"en-US": "Delete an existent ReactionRole",
				"pt-BR": "Deleta uma ReactionRole existente",
			},
			options: {
				channel: {
					name: {
						"en-US": "channel",
						"pt-BR": "canal",
					},
					description: {
						"en-US": "Channel where ReactionRole is located",
						"pt-BR": "Canal onde se localiza a ReactionRole",
					},
				},
				message: {
					name: {
						"en-US": "message",
						"pt-BR": "mensagem",
					},
					description: {
						"en-US": "Message ID used in ReactionRole",
						"pt-BR": "ID da mensagem utilizada na ReactionRole",
					},
				},
				role: {
					name: {
						"en-US": "role",
						"pt-BR": "cargo",
					},
					description: {
						"en-US": "Role used in ReactionRole",
						"pt-BR": "Cargo utilizado na ReactionRole",
					},
				},
				emoji: {
					name: {
						"en-US": "emoji",
						"pt-BR": "emoji",
					},
					description: {
						"en-US": "Emoji used in Reaction Role",
						"pt-BR": "Emoji utilizado na ReactionRole",
					},
				},
			},
		},
		edit: {
			name: {
				"en-US": "edit",
				"pt-BR": "editar",
			},
			description: {
				"en-US": "Edit an ReactionRole",
				"pt-BR": "Edita uma ReactionRole",
			},
			options: {
				channel: {
					name: {
						"en-US": "channel",
						"pt-BR": "canal",
					},
					description: {
						"en-US": "Channel where ReactionRole is located",
						"pt-BR": "Canal onde se localiza a ReactionRole",
					},
				},
				message: {
					name: {
						"en-US": "message",
						"pt-BR": "mensagem",
					},
					description: {
						"en-US": "Message ID used in ReactionRole",
						"pt-BR": "ID da mensagem utilizada na ReactionRole",
					},
				},
				role: {
					name: {
						"en-US": "role",
						"pt-BR": "cargo",
					},
					description: {
						"en-US": "Role used in ReactionRole",
						"pt-BR": "Cargo utilizado na ReactionRole",
					},
				},
				newRole: {
					name: {
						"en-US": "new_role",
						"pt-BR": "novo_cargo",
					},
					description: {
						"pt-BR": "Novo cargo a utilizado na ReactionRole",
					},
				},
				emoji: {
					name: {
						"pt-BR": "emoji",
					},
					description: {
						"pt-BR": "Emoji utilizado na ReactionRole",
					},
				},
			},
		},
		fetch: {
			name: {
				"en-US": "fetch",
				"pt-BR": "buscar",
			},
			description: {
				"en-US": "Fetch the existent ReactionRoles list in the server",
				"pt-BR": "Encontra a lista de ReactionRoles existentes no servidor",
			},
			options: {
				type: {
					name: {
						"en-US": "type",
						"pt-BR": "tipo",
					},
					description: {
						"en-US": "Type of fetch",
						"pt-BR": "Tipo de busca",
					},
				},
			},
		},
		delete_all: {
			name: {
				"en-US": "delete_all",
				"pt-BR": "deletar_tudo",
			},
			description: {
				"en-US": "Delete all ReactionRoles in the server",
				"pt-BR": "Deleta todas as ReactionRoles do Servidor",
			},
		},
		types: {
			name: { "en-US": "types", "pt-BR": "tipos" },
			description: {
				"en-US": "Show the types of ReactionRoles",
				"pt-BR": "Mostra os tipos de ReactionRoles",
			},
		},
	},
};
