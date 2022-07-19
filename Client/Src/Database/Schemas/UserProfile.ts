import { Schema, model, SchemaTypes } from "mongoose";

const UserProfileSchema: Schema = new Schema({
  ID: SchemaTypes.String,
  Username: SchemaTypes.String,
  NDCash: {
    NDCash: SchemaTypes.Number,
    Emprego: SchemaTypes.String,
    Level: SchemaTypes.Number,
    Worked: SchemaTypes.Number,
    Propina: SchemaTypes.Number,
    X2Time: SchemaTypes.Boolean,
    Daily: SchemaTypes.Number,
  },
  Bag: {
    Gifts: SchemaTypes.Number,
  },
  Guilds: [
    {
      ID: SchemaTypes.String,
      Name: SchemaTypes.String,
      XP: SchemaTypes.Number,
      Level: SchemaTypes.Number,
    },
  ],
});

const UserProfile = model("UserProfile", UserProfileSchema);
export default UserProfile;
