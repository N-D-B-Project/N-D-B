import { Localization } from "@/types";

export const DeveloperToolsLocalization: Localization = {
  name: {
    "en-US": "developer_tools",
    "pt-BR": "ferramentas_de_desenvolvimento"
  },
  description: {
    "en-US": "Category 🛠️ Developer Tools",
    "pt-BR": "Categoria 🛠️ Developer Tools"
  },
  options: {
    eval: {
      name: {
        "en-US": "evaluate",
        "pt-BR": "avaliar"
      },
      description: {
        "en-US":
          "Evaluate some codes to test it without restart the bot every time",
        "pt-BR":
          "Avalie alguns códigos para testá-lo sem reiniciar o bot todas as vezes"
      },
      options: {
        code: {
          name: {
            "en-US": "code",
            "pt-BR": "código"
          },
          description: {
            "en-US": "Code to begin evaluated",
            "pt-BR": "Código a ser avaliado"
          }
        }
      }
    },
    test: {
      name: {
        "en-US": "test",
        "pt-BR": "teste"
      },
      description: {
        "en-US": "Command for Testing things",
        "pt-BR": "Comando para testar coisas"
      }
    }
  }
};
