import mongoose from "mongoose";
import { ta } from "zod/locales";

const tagsSchema = new mongoose.Schema({
  title: { type: String },
});

const Tags = mongoose.model("Tags", tagsSchema);
export default Tags;
