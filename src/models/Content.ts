import mongoose, { mongo } from "mongoose";
import { required } from "zod/mini";

const contentSchema = new mongoose.Schema({
  link: {
    type: String,
  },
  title: { type: String },
  type: {
    type: String,
    enum: ["video", "audio", "image", "article"],
    required: true,
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Content = mongoose.model("Content", contentSchema);

export default Content;
