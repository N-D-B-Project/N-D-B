import * as Mongoose from "mongoose";
const BlacklistSchema: Mongoose.Schema = new Mongoose.Schema({
  User: String,
  Blacklist: Boolean,
});

const Blacklist = Mongoose.model("Blacklist", BlacklistSchema);
export default Blacklist;
