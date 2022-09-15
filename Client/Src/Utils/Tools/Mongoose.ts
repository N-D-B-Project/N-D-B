import NDBClient from "@Client/NDBClient";
import { GuildConfig, UserProfile } from "@Database/Schemas";
import { connect, connection, Document } from "mongoose";
import { ChannelType, Guild, Interaction, Message, User } from "discord.js";

export default class Mongoose {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async start() {
    const ConnectOptions = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    connect(process.env.MongoURI, ConnectOptions);

    connection.on("connected", () => {
      this.client.logger.database("MongoDB Connected!");
    });

    // set("useFindAndModify", false);

    connection.on("err", (err) => {
      this.client.logger.error(`Mongoose Connection error: ${err.stack}`);
    });

    connection.on("disconnected", () => {
      this.client.logger.error(`Mongoose Connection lost`);
    });
  }

  async FindGuildConfig(guild: Guild) {
    if (!guild) return;
    const guildConfig = await GuildConfig.findOne({ ID: guild.id });
    return guildConfig;
  }

  async CreateGuildConfig(guild: Guild) {
    try {
      await new GuildConfig({
        ID: guild.id,
        Name: guild.name,
        Settings: {
          Prefix: "&",
          Language: "pt-BR",
        },
        ReactionRoles: [],
        Channels: {
          LogChannel: null,
          FloodChannel: null,
        },
        Roles: {
          Default: null,
          Muted: null,
        },
        Systems: {
          AntiSpam: null,
          Logs: {
            DeletedMessages: null,
            ReactionDM: null,
          },
        },
      }).save();
      this.client.logger.database(
        `${this.client.user.username} Entrou no Server: ${guild.name} | Database Atualizada!`
      );
    } catch (error: any) {
      this.client.logger.error(error);
    }
  }

  async DeleteGuildConfig(guild: Guild, method: string) {
    if (!this.client.isReady) {
      return;
    } else {
      await GuildConfig.deleteOne({ ID: guild.id });

      this.client.logger.success(
        `${method} || ${this.client.user.username} Saiu do Server ${guild.name} / ${guild.id} | Database Atualizada!`
      );
    }
  }

  async UpdateGuildConfig(oldGuild: Guild, newGuild: Guild) {
    const guildConfig = await GuildConfig.findOne({ ID: oldGuild.id });
    guildConfig.$set({ ID: newGuild.id, Name: newGuild.name });
    guildConfig.save();
    this.client.logger.success(
      `Servidor: ${oldGuild.name} - (oldName) |/| ${newGuild.name} - (newName)\nFoi atualizado e Salvo na DataBase!`
    );
  }

  async FindUserProfile(user: User): Promise<Document> {
    const FindUserProfile = await UserProfile.findOne({ ID: user.id });
    return FindUserProfile;
  }

  async CreateUserProfile(msgint: Message | Interaction, user: User) {
    try {
      await new UserProfile({
        ID: user.id,
        Username: user.tag,
        Settings: {
          Prefix: "&",
          Language: "pt-BR",
        },
        NDCash: {
          NDCash: 0,
          Emprego: "Desempregado",
          Level: 1,
          Worked: 0,
          Propina: 0,
          X2Time: 0,
          Daily: 0,
        },
        Guilds: [
          {
            ID: msgint.guild.id,
            Name: msgint.guild.name,
            XP: 0,
            Level: 1,
          },
        ],
      }).save();
      this.client.logger.database(
        `${user.tag} / ${user.id} | Perfil Criado na Database`
      );
    } catch (error: any) {
      this.client.logger.error(error);
    }
  }

  async AddGuildToProfile(msgint: Message | Interaction, user: User) {
    try {
      if (msgint.channel.type === ChannelType.DM) return;
      const Profile = await this.FindUserProfile(user);
      var GetGuilds = Profile.get("Guilds");
      const AllGuilds = GetGuilds;
      var Verify: boolean = false;

      AllGuilds.forEach(async (guild: any) => {
        if (guild.ID == msgint.guild.id) {
          Verify = true;
        }
      });

      if (Verify) {
        return;
      } else {
        const newGuild = {
          ID: msgint.guild.id,
          Name: msgint.guild.name,
          XP: 0,
          Level: 1,
        };
        AllGuilds.push(newGuild);
        GetGuilds = AllGuilds;
        await Profile.save();
        this.client.logger.database(
          `${user.tag} / ${user.id} | Guild: ${msgint.guild.name} / ${msgint.guild.id} | Guild Added to Profile`
        );
      }
    } catch (error: any) {
      this.client.logger.error(error);
    }
  }

  async RemoveGuildFromProfile(guild: Guild, user: User) {
    try {
      const Profile = await this.FindUserProfile(user);

      var GetGuilds = Profile.get("Guilds");
      const AllGuilds = GetGuilds;
      var Verify: boolean = false;
      var XP: number = 0;
      var Level: number = 1;

      AllGuilds.forEach(async (guild: any) => {
        if (guild.ID == guild.id) {
          Verify = true;
          XP = guild.XP;
          Level = guild.Level;
          return;
        }
      });

      if (Verify) {
        const exitGuild = {
          ID: guild.id,
          Name: guild.name,
          XP,
          Level,
        };
        AllGuilds.pop(exitGuild);
        GetGuilds = AllGuilds;
        await Profile.save();
        this.client.logger.database(
          `${user.tag} / ${user.id} | Guild: ${guild.name} / ${guild.id} | Guild Removed from Profile`
        );
      } else {
        return;
      }
    } catch (error: any) {
      this.client.logger.error(error);
    }
  }
}
