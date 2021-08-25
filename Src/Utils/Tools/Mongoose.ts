import mongoose from "mongoose";
import { config } from "dotenv";
import NDBClient from "@/Client/Client";
import GuildConfig from "@Schema/GuildConfig";
import UserProfile from "@Schema/UserProfile";
config();

export default class MongoData {
  client: NDBClient;

  constructor(client) {
    this.client = client;
  }

  init = () => {
    const Connect = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    if (!process.env.MongoURI)
      this.client.logger.error(
        `Você deve definir o link do MongoDB para o Client.`
      );
    mongoose.connect(process.env.MongoURI, Connect).catch((e) => {
      this.client.logger.error(`Mongoose Connection Error\n${e}`);
    });

    mongoose.connection.on("connected", () => {
      this.client.logger.database("Client: MongoDB Conectado!");
    });

    mongoose.set("useFindAndModify", false);

    mongoose.connection.on("err", (err) => {
      this.client.logger.error(`Mongoose Connection error: ${err.stack}`);
    });

    mongoose.connection.on("disconnected", () => {
      this.client.logger.error(`Mongoose Connection lost`);
    });
  };

  async FindGuildConfig(guild) {
    const guildConfig = await GuildConfig.findOne({ ID: guild.id });
    return guildConfig;
  }

  async CreateGuildConfig(guild) {
    try {
      await new GuildConfig({
        ID: guild.id,
        Name: guild.name,
        Settings: {
          Prefix: "&",
          Language: "pt-BR",
        },
        Channels: {
          LogChannel: null,
          FloodChannel: null,
        },
        Roles: {
          Default: null,
          Muted: null,
        },
        Systens: {
          AntiSpam: false,
          Logs: {
            DeletedMessages: false,
          },
          ReactionDM: false,
        },
      }).save();
      this.client.logger.database(`${this.client.user.username} Entrou no Server: ${guild.name} | Database Atualizada!`);
    } catch (error) {
      this.client.logger.error(error)
    }
  }

  // async CreateOnStart(guilds) {
  //   const find = await this.FindGuildConfig(guild)
  //   if(!find) {
  //     await this.Create(guild)
  //   }
  // }

  async DeleteGuildConfig(guild) {
    await GuildConfig.deleteOne({ ID: guild.id });
    this.client.logger.success(
      `${this.client.user.username} Saiu do Server ${guild.name} | Database Atualizada!`
    );
  }

  async UpdateGuildConfig(oldGuild, newGuild) {
    const guildConfig = await GuildConfig.findOne({ ID: oldGuild.id });
    guildConfig.ID = newGuild.id;
    guildConfig.Name = newGuild.name;
    guildConfig.save();
    this.client.logger.success(
      `Servidor: ${oldGuild.name} - (oldName) |/| ${newGuild.name} - (newName)\nFoi atualizado e Salvo na DataBase!`
    );
  }

  async FindUserProfile(target) {
    const FindUserProfile = await UserProfile.findOne({ ID: target.id });
    return FindUserProfile;
  }

  async CreateUserProfile(target) {
    try {
      await new UserProfile({
        ID: target.id,
        Username: target.tag,
        NDCash: {
          NDCash: 0,
          Emprego: "Desempregado",
          Level: 1,
          Worked: 0,
          Propina: 0,
          X2Time: 0,
          Daily: 0,
        }
      }).save();
      this.client.logger.database(`${target.tag} / ${target.id} | Perfil Criado na Database`)
    } catch (error) {
      this.client.logger.error(error)
    }
  }

  DataCheck(target) {
    if (target == undefined || !target) {
      return "`Não definido`";
    } else if (target == false) {
      return "`Desativado`";
    } else if (target == true) {
      return "`Ativo`";
    } else if (target) {
      return target;
    }
  }

  DataCheckRoles(target) {
    if (target == undefined || null || false || !target) {
      return "`Não definido`";
    } else if (target) {
      return `<@&${target}>`;
    }
  }

  DataCheckChannels(target) {
    if (target == undefined || null || false || !target) {
      return "`Não definido`";
    } else if (target) {
      return `<#${target}>`;
    }
  }

  DataCheckLanguage(target) {
    switch (target) {
      case "pt-BR":
        return ":flag_br: Português Brasileiro"
      break;
    }
  }

  Schemas = {
    "GuildConfig": require("@Schema/GuildConfig"),
    "UserProfile": require("@Schema/UserProfile"),
    "ReactionRole": require("@Schema/ReactionRole"),
    "Blacklist": require("@Schema/Blacklist")
  }
}
