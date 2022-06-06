import { Schema, model } from "mongoose";
import { IUser } from "~/Types";

const UserProfileSchema: Schema = new Schema<IUser>({
  ID: String,
  Username: String,
  NDCash: {
    NDCash: Number,
    Emprego: String,
    Level: Number,
    Worked: Number,
    Propina: Number,
    X2Time: Boolean,
    Daily: Number,
  },
  Bag: {
    Gifts: Number,
  },
  Guilds: [
    {
      ID: String,
      Name: String,
      XP: Number,
      Level: Number,
    },
  ],
});

const UserProfile = model("UserProfile", UserProfileSchema);
export default UserProfile;
