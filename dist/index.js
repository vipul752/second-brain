"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./models/User"));
const Content_1 = __importDefault(require("./models/Content"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("./config/db"));
const middleware_1 = __importDefault(require("./middleware/middleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, db_1.default)();
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(411).json({
                message: "All field requried",
            });
        }
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "Username already taken",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({
            username,
            password: hashedPassword,
        });
        return res.status(200).json({
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(411).json({
                message: "All field requried",
            });
        }
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: "user not found",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "vipul123", { expiresIn: "1h" });
        return res.status(200).json({
            message: "signin successful",
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}));
// @ts-ignore
app.post("/api/v1/content", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, title, type } = req.body;
        const content = yield Content_1.default.create({
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}));
// @ts-ignore
app.get("/api/v1/content", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.userId;
        const contents = yield Content_1.default.find({ userId }).populate("userId", "username");
        return res.status(200).json({
            contents,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}));
app.delete("/api/v1/content/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Content_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            message: "content deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}));
app.post("/api/v1/brainly/share", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId } = req.body;
        return res.status(200).json({
            message: "content shared with brain successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
