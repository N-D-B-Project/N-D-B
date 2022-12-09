import { Schema, model, SchemaTypes, Document } from "mongoose";
import { Guild, type User } from "discord.js";
import { IUser, IUserMethods, IUserModel, EUserJobs } from "~/Types/schemas";
import NDBClient from "@Client/NDBClient";
const UserConfigSchema = new Schema<IUser, IUserModel, IUserMethods>({
  ID: { type: SchemaTypes.String, unique: true, required: true },
  Username: { type: SchemaTypes.String, unique: false, required: true },
  Settings: {
    Prefix: { type: SchemaTypes.String, required: true, default: "&" },
    Language: { type: SchemaTypes.String, required: true, default: "en-US" },
  },
  NDCash: {
    NDCash: { type: SchemaTypes.Number, required: true, default: 0 },
    Emprego: {
      type: SchemaTypes.String,
      required: true,
      default: EUserJobs.Jobless,
    },
    Level: { type: SchemaTypes.Number, required: true, default: 1 },
    Worked: { type: SchemaTypes.Number, required: true, default: 0 },
    Propina: { type: SchemaTypes.Number, required: true, default: 0 },
    X2Time: SchemaTypes.Boolean,
    Daily: { type: SchemaTypes.Number, required: true, default: 0 },
  },
  Bag: {
    Gifts: { type: SchemaTypes.Number, required: true, default: 0 },
  },
  Guilds: [
    {
      ID: SchemaTypes.String,
      Name: SchemaTypes.String,
      XP: { type: SchemaTypes.Number, required: true, default: 0 },
      Level: { type: SchemaTypes.Number, required: true, default: 1 },
    },
  ],
});

UserConfigSchema.static("getUser", async function (User: User): Promise<
  Document<IUser, IUserMethods>
> {
  return await this.findOne({ ID: User.id });
});

UserConfigSchema.static(
  "CreateUser",
  async function (client: NDBClient, User: User) {
    try {
      await new UserConfig({
        ID: User.id,
        Name: User.username,
      }).save();
      client.logger.database(
        `${User.tag} / ${User.id} | User Created in Database!`
      );
    } catch (error) {
      client.logger.error("CreateUserConfig Error: ", error);
    }
  }
);

UserConfigSchema.static(
  "DeleteUser",
  async function (client: NDBClient, User: User) {
    await UserConfig.deleteOne({ ID: User.id });
    client.logger.database(
      `${User.tag} / ${User.id} | User Deleted from Database!`
    );
  }
);

// UserConfigSchema.static("UpdateUser")

UserConfigSchema.static(
  "AddGuild",
  async function (client: NDBClient, User: User, Guild: Guild) {
    try {
      const Config = await this.getUser(User);
      var Guilds: Array<any> = Config.get("Guilds");
      var Verify: boolean = false;

      Guilds.forEach(async (Object) => {
        if (Object.ID === Guild.id) {
          Verify = true;
        }
      });

      if (!Verify) {
        Guilds.push({ ID: Guild.id, Name: Guild.name, XP: 0, Level: 1 });
        await Config.save();
        client.logger.database(
          `${User.tag} / ${User.id} | Guild: ${Guild.name} / ${Guild.id} | Guild Added to Profile`
        );
      }
    } catch (error) {
      client.logger.error("UserAddGuild Error: ", error);
    }
  }
);

UserConfigSchema.static(
  "RemoveGuild",
  async function (client: NDBClient, User: User, Guild: Guild) {
    try {
      const Config = await this.getUser(User);
      var Guilds: Array<any> = Config.get("Guilds");
      var Verify: boolean = false;
      var GuildObject;

      Guilds.forEach(async (Object) => {
        if (Object.ID === Guild.id) {
          Verify = true;
          GuildObject = Object;
        }
      });

      if (!Verify) {
        const index = Guilds.indexOf(GuildObject);
        Guilds.splice(index, 1);
        await Config.save();
        client.logger.database(
          `${User.tag} / ${User.id} | Guild: ${Guild.name} / ${Guild.id} | Guild Removed from Profile`
        );
      }
    } catch (error) {
      client.logger.error("UserAddGuild Error: ", error);
    }
  }
);

UserConfigSchema.pre("save", async function (next) {
  if (this.isNew) {
    return next();
  } else if (this.isModified("ID")) {
    throw new Error("Cannot change the User's ID");
  }
});

const UserConfig = model("UserConfig", UserConfigSchema);
export default UserConfig;
