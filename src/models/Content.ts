import mongoose, { mongo } from "mongoose";
import { required } from "zod/mini";

const contentSchema = new mongoose.Schema(
  {
    link: {
      type: String,
    },
    title: { type: String },
    type: {
      type: String,
      required: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;
