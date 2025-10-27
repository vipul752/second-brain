import express from "express";
import User from "./models/User";
import Content from "./models/Content";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "./config/db";
import authMiddleware from "./middleware/middleware";
import cors from "cors";
import Link from "./models/Link";
import { time, timeStamp } from "console";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
``;
connectDB();

app.post("/api/v1/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(411).json({
        message: "All field requried",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(411).json({
        message: "All field requried",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, "vipul123", { expiresIn: "1h" });

    return res.status(200).json({
      message: "signin successful",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});
// @ts-ignore
app.post("/api/v1/content", authMiddleware, async (req, res) => {
  try {
    const { link, title, type } = req.body;
    const content = await Content.create({
      link,
      title,
      type,
      // @ts-ignore
      userId: req.userId,
      tags: [],
    });

    return res.status(200).json({
      content,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

// @ts-ignore
app.get("/api/v1/content", authMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const contents = await Content.find({ userId }).populate(
      "userId",
      "username"
    );
    return res.status(200).json({
      contents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

//@ts-ignore
app.delete("/api/v1/content/:id", authMiddleware, async (req, res) => {
  try {
    const contentId = req.params.id;

    await Content.findByIdAndDelete({
      _id: contentId,
      // @ts-ignore
      userId: req.userId,
      timestamps: true,
    });

    return res.status(200).json({
      message: "content deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

//@ts-ignore
app.post("/api/v1/brain/share", authMiddleware, async (req, res) => {
  try {
    const { share } = req.body;

    if (share) {
      //@ts-ignore
      const existingLink = await Link.findOne({ userId: req.userId });
      if (existingLink) {
        res.json({ hash: existingLink.hash });
        return;
      }

      const hash = Math.random().toString(36).substring(2, 8);
      //@ts-ignore

      await Link.create({ userId: req.userId, hash });
      res.json({ hash });
    } else {
      //@ts-ignore

      await Link.deleteOne({ userId: req.userId });
      res.json({ message: "Removed link" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await Link.findOne({ hash });
  if (!link) {
    res.status(404).json({ message: "Invalid share link" });
    return;
  }

  const content = await Content.find({ userId: link.userId });
  const user = await User.findOne({ _id: link.userId });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({
    username: user.username,
    content,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
