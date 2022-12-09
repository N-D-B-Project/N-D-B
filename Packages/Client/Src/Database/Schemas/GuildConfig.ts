import { type Guild } from "discord.js";
import { Schema, model, SchemaTypes, Document } from "mongoose";
import NDBClient from "~/Client/NDBClient";
import {
  IGuild,
  IGuildMethods,
  IGuildConfigModel,
  IReactionSchema,
} from "~/Types/schemas";

const GuildConfigSchema = new Schema<IGuild, IGuildConfigModel, IGuildMethods>({
  ID: { type: SchemaTypes.String, unique: true, required: true },
  Name: { type: SchemaTypes.String, unique: false, required: true },
  Settings: {
    Prefix: {
      type: SchemaTypes.String,
      unique: false,
      required: true,
      default: "&",
    },
    Language: {
      type: SchemaTypes.String,
      unique: false,
      required: true,
      default: "en-US",
    },
  },
  Channels: {
    Logs: {
      type: SchemaTypes.Number,
      unique: false,
      required: false,
      default: null,
    },
    Flood: {
      type: SchemaTypes.Number,
      unique: false,
      required: false,
      default: null,
    },
  },
  Roles: {
    Default: {
      type: SchemaTypes.Number,
      unique: false,
      required: false,
      default: null,
    },
    Muted: {
      type: SchemaTypes.Number,
      unique: false,
      required: false,
      default: null,
    },
  },
  ReactionRoles: [
    {
      message: {
        type: SchemaTypes.String,
        unique: false,
        required: false,
      },
      channel: {
        type: SchemaTypes.Number,
        unique: false,
        required: false,
      },
      role: {
        type: SchemaTypes.Number,
        unique: false,
        required: false,
      },
      emoji: {
        type: SchemaTypes.String,
        unique: false,
        required: false,
      },
      option: {
        type: SchemaTypes.Number,
        unique: false,
        required: false,
      },
    },
  ],
  Systems: {
    AntiSpam: { type: SchemaTypes.Boolean, required: false },
    Logs: {
      DeletedMessages: { type: SchemaTypes.Boolean, required: false },
      ReactionDM: { type: SchemaTypes.Boolean, required: false },
    },
  },
});

GuildConfigSchema.static(
  "getGuildConfig",
  async function getGuildConfig(
    Guild: Guild
  ): Promise<Document<IGuild, IGuildMethods>> {
    return await this.findOne({ ID: Guild.id });
  }
);

GuildConfigSchema.static(
  "getReactionRoles",
  async function getReactionRoles(
    Guild: Guild
  ): Promise<Array<IReactionSchema>> {
    const Find = await this.getGuildConfig(Guild);
    return Find.get("ReactionRoles");
  }
);

GuildConfigSchema.static(
  "CreateConfig",
  async function (client: NDBClient, Guild: Guild) {
    try {
      await new GuildConfig({
        ID: Guild.id,
        Name: Guild.name,
      }).save();
      client.logger.database(
        `${client.user.username} Joined the Guild: ${Guild.name} | Database Updated!`
      );
    } catch (error) {
      client.logger.error("CreateGuildConfig Error: ", error);
    }
  }
);

GuildConfigSchema.static(
  "DeleteConfig",
  async function (client: NDBClient, Guild: Guild) {
    if (!client.isReady) {
      return;
    } else {
      await GuildConfig.deleteOne({ ID: Guild.id });
      client.logger.database(
        `${client.user.username} has left the Guild ${Guild.name} / ${Guild.id} | Database Updated!`
      );
    }
  }
);

GuildConfigSchema.static(
  "UpdateConfig",
  async function (client: NDBClient, oldGuild: Guild, newGuild: Guild) {
    (await this.getGuildConfig(newGuild)).$set({
      Name: newGuild.name,
    });
    client.logger.database(
      `Guild: ${oldGuild.name} - (oldName) |/| ${newGuild.name} - (newName)\nDatabase Updated!`
    );
  }
);

GuildConfigSchema.pre("save", async function (next) {
  if (this.isNew) {
    return next();
  } else if (this.isModified("ID")) {
    throw new Error("Cannot change the Guild's ID");
  }
});

const GuildConfig = model<IGuild, IGuildConfigModel>(
  "GuildConfig",
  GuildConfigSchema
);

export default GuildConfig;
