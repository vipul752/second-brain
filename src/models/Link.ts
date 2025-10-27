import mongoose from "mongoose";
import { ref } from "process";

const linkSchema = new mongoose.Schema({
  hash: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Link = mongoose.model("Link", linkSchema);

export default Link;
