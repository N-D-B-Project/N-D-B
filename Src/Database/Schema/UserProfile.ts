import { IUser } from "@/Types/Shemas";
import * as Mongoose from "mongoose";

const UserProfileSchema: IUser | Mongoose.Schema = new Mongoose.Schema({
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
  }
});

const UserProfile = Mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
